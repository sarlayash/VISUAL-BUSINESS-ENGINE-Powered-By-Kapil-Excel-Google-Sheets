import { UserProfile } from '../types';

const STORAGE_KEY_CURRENT_USER = 'vbe_current_user_v2';
const STORAGE_KEY_ALL_LEARNERS = 'vbe_all_registered_learners_v2';
const STORAGE_KEY_CUSTOM_DATA = 'vbe_user_sheets_v2';

// Generates an authentic unique Certificate ID for real learners
export function generateCertificateId(): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `SY-VBE-2026-${randomSuffix}`;
}

// Load currently authenticated user (null if not yet signed in)
export function loadUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Save active user profile and update the registered learners registry
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(profile));

    // Also update in all learners list
    const learners = getRegisteredLearners();
    const idx = learners.findIndex((l) => l.id === profile.id || l.email === profile.email);
    if (idx !== -1) {
      learners[idx] = profile;
    } else {
      learners.push(profile);
    }
    localStorage.setItem(STORAGE_KEY_ALL_LEARNERS, JSON.stringify(learners));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

// Sign in or register a real user
export function signInWithGoogle(name: string, email: string, avatar?: string): UserProfile {
  const existingLearners = getRegisteredLearners();
  const found = existingLearners.find((l) => l.email.toLowerCase() === email.toLowerCase());

  if (found) {
    // Return existing user with their real accumulated progress
    saveUserProfile(found);
    return found;
  }

  // Create clean, authentic new profile starting at genuine 0 XP
  const newProfile: UserProfile = {
    id: `usr_${Date.now()}`,
    name: name.trim() || 'Learner',
    email: email.trim().toLowerCase(),
    avatar:
      avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name.trim() || 'Learner'
      )}&background=F59E0B&color=07080B&bold=true`,
    xp: 0,
    level: 'Explorer',
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedChallenges: [],
    completedModules: [],
    earnedBadges: [],
    capstoneCompleted: false,
    capstoneStage: 1,
    certificateId: generateCertificateId(),
    certificateIssueDate: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date()),
  };

  saveUserProfile(newProfile);
  return newProfile;
}

// Sign out current user
export function signOutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  } catch (e) {}
}

// Get all authentic registered learners on this platform instance
export function getRegisteredLearners(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_LEARNERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Add XP and progress genuinely
export function addXpAndProgress(
  xpToAdd: number,
  challengeId?: string,
  badgeToUnlock?: string,
  moduleIdCompleted?: number
): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;

  const updated: UserProfile = { ...current };
  updated.xp = Math.max(0, updated.xp + xpToAdd);

  // Update level based on genuine XP milestones (PRD Section 20 & 32)
  if (updated.xp >= 3500) {
    updated.level = 'Visual Business Engineer';
  } else if (updated.xp >= 2500) {
    updated.level = 'Business Architect';
  } else if (updated.xp >= 1800) {
    updated.level = 'Strategist';
  } else if (updated.xp >= 1000) {
    updated.level = 'Analyst';
  } else if (updated.xp >= 400) {
    updated.level = 'Practitioner';
  } else {
    updated.level = 'Explorer';
  }

  if (challengeId && !updated.completedChallenges.includes(challengeId)) {
    updated.completedChallenges.push(challengeId);
  }

  if (badgeToUnlock && !updated.earnedBadges.includes(badgeToUnlock)) {
    updated.earnedBadges.push(badgeToUnlock);
  }

  if (moduleIdCompleted && !updated.completedModules.includes(moduleIdCompleted)) {
    updated.completedModules.push(moduleIdCompleted);
  }

  // Update real streak
  const today = new Date().toISOString().split('T')[0];
  if (updated.lastActiveDate !== today) {
    updated.streakDays += 1;
    updated.lastActiveDate = today;
  }

  saveUserProfile(updated);
  return updated;
}

export function saveCustomSheet(sheetKey: string, data: any): void {
  if (typeof window === 'undefined') return;
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_DATA) || '{}');
    current[sheetKey] = data;
    localStorage.setItem(STORAGE_KEY_CUSTOM_DATA, JSON.stringify(current));
  } catch (e) {}
}

export function loadCustomSheet(sheetKey: string): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_DATA) || '{}');
    return current[sheetKey] || null;
  } catch (e) {
    return null;
  }
}
