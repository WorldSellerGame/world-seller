import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import { IncrementStat, ResetAchievements, ResetStats, UnlockAchievement } from './achievements.actions';
import { incrementStat, resetAchievementList, resetAchievements, resetStats, unlockAchievement } from './achievements.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetAchievements },
  { action: ResetStats, handler: resetStats },
  { action: ResetAchievements, handler: resetAchievementList },
  { action: IncrementStat, handler: incrementStat },
  { action: UnlockAchievement, handler: unlockAchievement }
];
