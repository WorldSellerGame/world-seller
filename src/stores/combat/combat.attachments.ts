import { IAttachment } from '../../interfaces/store';
import { DeleteCharacter } from '../charselect/charselect.actions';
import {
  AddCombatLogMessage,
  ConsumeFoodCharges,
  DebugApplyEffectToPlayer,
  DebugSetPlayerEnergy,
  DebugSetPlayerHealth,
  EndCombat,
  EndCombatAndResetPlayer,
  EnemyCooldownSkill,
  EnemySpeedReset,
  GainCombatLevels,
  LowerEnemyCooldown,
  LowerPlayerCooldown,
  OOCEatFood,
  OOCPlayerEnergy,
  OOCPlayerHeal,
  PlayerCooldownSkill,
  PlayerSpeedReset,
  ResetCombat, ResetCombatSoft, SetCombatLock, SetCombatLockForEnemies, SetFood, SetItem,
  SetSkill, StartCombatEndProcess, TickEnemyEffects, TickPlayerEffects, UnlockCombat, UseItemInSlot
} from './combat.actions';
import {
  addCombatLogMessage,
  applyEffectToPlayer,
  consumeFoodCharges,
  debugSetCombatEnergy,
  debugSetCombatHealth,
  endCombat,
  endCombatAndResetPlayer,
  gainCombatLevels,
  lowerEnemyCooldowns,
  lowerPlayerCooldowns,
  oocEatFood,
  oocPlayerEnergy,
  oocPlayerHeal,
  prepareCombatForRestart,
  resetCombat, resetCombatSoft, resetEnemySpeed, resetPlayerSpeed, setCombatLock,
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
  { action: GainCombatLevels, handler: gainCombatLevels },
  { action: ResetCombat, handler: resetCombat },
  { action: ResetCombatSoft, handler: resetCombatSoft },
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
  { action: StartCombatEndProcess, handler: prepareCombatForRestart },
  { action: DebugApplyEffectToPlayer, handler: applyEffectToPlayer },
  { action: DebugSetPlayerHealth, handler: debugSetCombatHealth },
  { action: DebugSetPlayerEnergy, handler: debugSetCombatEnergy },

  { action: FullyHeal, handler: fullyHeal },
  { action: LeaveDungeon, handler: leaveDungeon },
  { action: EmptyDungeonTile, handler: emptyDungeonTile },
  { action: MoveInDungeonByDelta, handler: moveInDungeonByDelta },
  { action: MoveInDungeon, handler: moveInDungeon },
  { action: GainPercentageOfDungeonLoot, handler: gainPercentageOfDungeonLoot },
  { action: OOCPlayerHeal, handler: oocPlayerHeal },
  { action: OOCPlayerEnergy, handler: oocPlayerEnergy },
  { action: OOCEatFood, handler: oocEatFood }
];
