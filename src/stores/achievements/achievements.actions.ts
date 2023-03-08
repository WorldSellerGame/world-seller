import { AchievementStat } from '../../interfaces';

export class IncrementStat {
  static type = '[Achievements] Increment Stat';
  constructor(public stat: AchievementStat | string, public value = 1) {}
}

export class UnlockAchievement {
  static type = '[Achievements] Unlock Achievement';
  constructor(public achievement: string) {}
}

export class ResetStats {
  static type = '[Achievements] Reset Stats';
}

export class ResetAchievements {
  static type = '[Achievements] Reset Achievements';
}
