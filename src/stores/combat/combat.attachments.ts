import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import {
  AddCombatLogMessage,
  ConsumeFoodCharges,
  EndCombat,
  EndCombatAndResetPlayer,
  EnemyCooldownSkill,
  EnemySpeedReset,
  LowerEnemyCooldown,
  LowerPlayerCooldown,
  PlayerCooldownSkill,
  PlayerSpeedReset,
  ResetCombat, SetCombatLock, SetCombatLockForEnemies, SetFood, SetItem,
  SetSkill, TickEnemyEffects, TickPlayerEffects, UnlockCombat, UseItemInSlot
} from './combat.actions';
import {
  addCombatLogMessage,
  consumeFoodCharges,
  endCombat,
  endCombatAndResetPlayer,
  lowerEnemyCooldowns,
  lowerPlayerCooldowns,
  resetCombat, resetEnemySpeed, resetPlayerSpeed, setCombatLock,
  setCombatLockForEnemies,
  setEnemySkillOnCooldown, setFoodInSlot, setItemInSlot,
  setPlayerSkillOnCooldown, setSkillInSlot, tickEnemyEffects, tickPlayerEffects, unlockCombat, useItemInSlot
} from './combat.functions';

import {
  EmptyDungeonTile, FullyHeal, GainPercentageOfDungeonLoot,
  LeaveDungeon, MoveInDungeon, MoveInDungeonByDelta
} from './dungeon.actions';
import {
  emptyDungeonTile, fullyHeal, gainPercentageOfDungeonLoot,
  leaveDungeon, moveInDungeon, moveInDungeonByDelta
} from './dungeon.functions';


export const attachments: IAttachment[] = [
  { action: DeleteCharacter, handler: resetCombat },
  { action: UnlockCombat, handler: unlockCombat },
  { action: ResetCombat, handler: resetCombat },
  { action: EndCombat, handler: endCombat },
  { action: EndCombatAndResetPlayer, handler: endCombatAndResetPlayer },
  { action: SetSkill, handler: setSkillInSlot },
  { action: SetItem, handler: setItemInSlot },
  { action: SetFood, handler: setFoodInSlot },
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
  { action: TickEnemyEffects, handler: tickEnemyEffects },
  { action: ConsumeFoodCharges, handler: consumeFoodCharges },

  { action: FullyHeal, handler: fullyHeal },
  { action: LeaveDungeon, handler: leaveDungeon },
  { action: EmptyDungeonTile, handler: emptyDungeonTile },
  { action: MoveInDungeonByDelta, handler: moveInDungeonByDelta },
  { action: MoveInDungeon, handler: moveInDungeon },
  { action: GainPercentageOfDungeonLoot, handler: gainPercentageOfDungeonLoot }
];
