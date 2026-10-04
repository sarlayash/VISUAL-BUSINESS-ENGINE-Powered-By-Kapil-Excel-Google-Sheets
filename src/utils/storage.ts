import { UserProfile } from '../types';

const STORAGE_KEY_PROFILE = 'vbe_learner_profile_v1';
const STORAGE_KEY_CUSTOM_DATA = 'vbe_user_sheets_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_kapil_2026',
  name: 'Kapil',
  email: 'kapil@sarlayash.org',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 1250,
  level: 'Analyst',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedChallenges: ['m1_c1', 'm1_c2', 'm1_c3'],
  completedModules: [],
  earnedBadges: ['Data Preparation Explorer'],
  capstoneCompleted: false,
  capstoneStage: 1,
  certificateId: 'SY-VBE-2026-000124',
  certificateIssueDate: 'October 4, 2026',
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) {
      saveUserProfile(DEFAULT_USER_PROFILE);
      return DEFAULT_USER_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function addXpAndProgress(
  xpToAdd: number,
  challengeId?: string,
  badgeToUnlock?: string,
  moduleIdCompleted?: number
): UserProfile {
  const current = loadUserProfile();
  const updated: UserProfile = { ...current };

  updated.xp = Math.max(0, updated.xp + xpToAdd);

  // Update level based on XP thresholds (PRD Page 28 / Page 20)
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

  // Update streak
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
