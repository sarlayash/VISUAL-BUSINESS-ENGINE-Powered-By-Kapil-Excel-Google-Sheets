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
export function signInWithGoogle(name: string, email: string, avatar?: string, uid?: string): UserProfile {
  const existingLearners = getRegisteredLearners();
  const found = existingLearners.find((l) => (uid && l.id === uid) || l.email.toLowerCase() === email.toLowerCase());

  if (found) {
    if (avatar && !found.avatar.includes('http')) found.avatar = avatar;
    if (name && found.name === 'Learner') found.name = name;
    // Return existing user with their real accumulated progress
    saveUserProfile(found);
    return found;
  }

  // Create clean, authentic new profile starting at genuine 0 XP
  const newProfile: UserProfile = {
    id: uid || `usr_${Date.now()}`,
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

// Save Assessment Mock Test result with strict 80% passing threshold
export function saveModuleAssessmentResult(
  moduleId: number,
  badgeName: string,
  score: number,
  correctQuestions: number,
  totalQuestions: number,
  correctExercises: number,
  totalExercises: number,
  timeSpentSeconds: number
): { profile: UserProfile; passed: boolean } | null {
  const current = loadUserProfile();
  if (!current) return null;

  const passed = score >= 80;
  const updated: UserProfile = { ...current };

  if (!updated.moduleScores) {
    updated.moduleScores = {};
  }

  const prevBest = updated.moduleScores[moduleId]?.score || 0;
  const bestScore = Math.max(score, prevBest);

  updated.moduleScores[moduleId] = {
    moduleId,
    score: bestScore,
    passed: bestScore >= 80,
    correctQuestions,
    totalQuestions,
    correctExercises,
    totalExercises,
    timeSpentSeconds,
    completedAt: new Date().toISOString(),
  };

  // Strictly unlock module badge & completion only if score >= 80%
  if (passed) {
    if (!updated.earnedBadges.includes(badgeName)) {
      updated.earnedBadges.push(badgeName);
    }
    if (!updated.completedModules.includes(moduleId)) {
      updated.completedModules.push(moduleId);
    }
    // Award XP for passing timed assessment with honors
    updated.xp += 250;

    // Check if all 5 modules passed with >= 80% to award the grand trophy
    if (
      [1, 2, 3, 4, 5].every((m) => updated.moduleScores?.[m]?.passed) &&
      !updated.earnedBadges.includes('Visual Business Engineer')
    ) {
      updated.earnedBadges.push('Visual Business Engineer');
      updated.xp += 500;
    }
  }

  // Recalculate level
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

  saveUserProfile(updated);
  return { profile: updated, passed };
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

// ================= USER AGENCY: MARK AS COMPLETE & ACKNOWLEDGE =================

export function toggleChallengeComplete(challengeId: string): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.completedChallenges || [])];
  const idx = list.indexOf(challengeId);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(challengeId);
    updated.xp += 100;
  }
  updated.completedChallenges = list;
  saveUserProfile(updated);
  return updated;
}

export function toggleLabComplete(labId: string): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.completedLabs || [])];
  const idx = list.indexOf(labId);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(labId);
    updated.xp += 150;
  }
  updated.completedLabs = list;
  saveUserProfile(updated);
  return updated;
}

export function toggleCapstoneStageComplete(stageNumber: number): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.completedCapstoneStages || [])];
  const idx = list.indexOf(stageNumber);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(stageNumber);
    updated.xp += 200;
  }
  updated.completedCapstoneStages = list;
  if (list.length >= 9) {
    updated.capstoneCompleted = true;
  }
  saveUserProfile(updated);
  return updated;
}

export function toggleSectionComplete(sectionId: string): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.completedSections || [])];
  const idx = list.indexOf(sectionId);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(sectionId);
    updated.xp += 50;
  }
  updated.completedSections = list;
  saveUserProfile(updated);
  return updated;
}

export function toggleModuleComplete(moduleId: number): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.completedModules || [])];
  const idx = list.indexOf(moduleId);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(moduleId);
    updated.xp += 250;
  }
  updated.completedModules = list;
  saveUserProfile(updated);
  return updated;
}

export function toggleKnowledgeByteAcknowledged(byteId: string): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const list = [...(updated.acknowledgedBytes || [])];
  const idx = list.indexOf(byteId);
  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(byteId);
    updated.xp += 30;
  }
  updated.acknowledgedBytes = list;
  saveUserProfile(updated);
  return updated;
}

export function acknowledgeAllKnowledgeBytes(allByteIds: string[]): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const existing = new Set(updated.acknowledgedBytes || []);
  let newlyAdded = 0;
  allByteIds.forEach((id) => {
    if (!existing.has(id)) {
      existing.add(id);
      newlyAdded++;
    }
  });
  updated.acknowledgedBytes = Array.from(existing);
  updated.xp += newlyAdded * 30;
  saveUserProfile(updated);
  return updated;
}

export function markAllModuleItemsComplete(moduleId: number, challengeIds: string[]): UserProfile | null {
  const current = loadUserProfile();
  if (!current) return null;
  const updated = { ...current };
  const challengeSet = new Set(updated.completedChallenges || []);
  challengeIds.forEach((id) => challengeSet.add(id));
  updated.completedChallenges = Array.from(challengeSet);

  if (!updated.completedModules.includes(moduleId)) {
    updated.completedModules.push(moduleId);
  }
  updated.xp += 300;
  saveUserProfile(updated);
  return updated;
}

