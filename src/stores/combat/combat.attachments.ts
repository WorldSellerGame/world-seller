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
  ResetCombat, SetCombatLock, SetCombatLockForEnemies, SetItem, SetSkill, TickEnemyEffects, TickPlayerEffects, UseItemInSlot
} from './combat.actions';
import {
  addCombatLogMessage,
  endCombat,
  endCombatAndResetPlayer,
  lowerEnemyCooldowns,
  lowerPlayerCooldowns,
  resetCombat, resetEnemySpeed, resetPlayerSpeed, setCombatLock,
  setCombatLockForEnemies,
  setEnemySkillOnCooldown, setItemInSlot, setPlayerSkillOnCooldown, setSkillInSlot, tickEnemyEffects, tickPlayerEffects, useItemInSlot
} from './combat.functions';


export const attachments: IAttachment[] = [
  { action: ResetCombat, handler: resetCombat },
  { action: EndCombat, handler: endCombat },
  { action: EndCombatAndResetPlayer, handler: endCombatAndResetPlayer },
  { action: SetSkill, handler: setSkillInSlot },
  { action: SetItem, handler: setItemInSlot },
  { action: UseItemInSlot, handler: useItemInSlot },
  { action: AddCombatLogMessage, handler: addCombatLogMessage },
  { action: SetCombatLock, handler: setCombatLock },
  { action: SetCombatLockForEnemies, handler: setCombatLockForEnemies },
  { action: PlayerCooldownSkill, handler: setPlayerSkillOnCooldown },
  { action: EnemyCooldownSkill, handler: setEnemySkillOnCooldown },
  { action: LowerPlayerCooldown, handler: lowerPlayerCooldowns },
  { action: LowerEnemyCooldown, handler: lowerEnemyCooldowns },
  { action: PlayerSpeedReset, handler: resetPlayerSpeed },
  { action: EnemySpeedReset, handler: resetEnemySpeed },
  { action: TickPlayerEffects, handler: tickPlayerEffects },
  { action: TickEnemyEffects, handler: tickEnemyEffects }
];
