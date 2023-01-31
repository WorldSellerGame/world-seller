import { IAttachment } from '../../interfaces/store';
import {
  AddCombatLogMessage,
  EndCombat,
  EndCombatAndResetPlayer,
  EnemyCooldownSkill,
  EnemySpeedReset,
  LowerEnemyCooldown,
  LowerPlayerCooldown,
  PlayerCooldownSkill,
  PlayerSpeedReset,
  ResetCombat, SetCombatLock, SetCombatLockForEnemies, SetSkill, TargetEnemyWithAbility, TargetSelfWithAbility
} from './combat.actions';
import {
  addCombatLogMessage,
  endCombat,
  endCombatAndResetPlayer,
  lowerEnemyCooldowns,
  lowerPlayerCooldowns,
  resetCombat, resetEnemySpeed, resetPlayerSpeed, setCombatLock,
  setCombatLockForEnemies,
  setEnemySkillOnCooldown, setPlayerSkillOnCooldown, setSkillInSlot, targetEnemyWithAbility, targetSelfWithAbility
} from './combat.functions';


export const attachments: IAttachment[] = [
  { action: ResetCombat, handler: resetCombat },
  { action: EndCombat, handler: endCombat },
  { action: EndCombatAndResetPlayer, handler: endCombatAndResetPlayer },
  { action: SetSkill, handler: setSkillInSlot },
  { action: AddCombatLogMessage, handler: addCombatLogMessage },
  { action: SetCombatLock, handler: setCombatLock },
  { action: SetCombatLockForEnemies, handler: setCombatLockForEnemies },
  { action: PlayerCooldownSkill, handler: setPlayerSkillOnCooldown },
  { action: EnemyCooldownSkill, handler: setEnemySkillOnCooldown },
  { action: LowerPlayerCooldown, handler: lowerPlayerCooldowns },
  { action: LowerEnemyCooldown, handler: lowerEnemyCooldowns },
  { action: PlayerSpeedReset, handler: resetPlayerSpeed },
  { action: EnemySpeedReset, handler: resetEnemySpeed },
  { action: TargetEnemyWithAbility, handler: targetEnemyWithAbility },
  { action: TargetSelfWithAbility, handler: targetSelfWithAbility }
];
