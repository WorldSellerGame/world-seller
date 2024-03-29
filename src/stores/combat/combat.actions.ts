import { IGameCombatAbility, IGameEncounterCharacter, IGameItem, IGameStatusEffect } from '../../interfaces';

export class UnlockCombat {
  static type = '[Combat] Unlock';
  constructor() {}
}

export class GainCombatLevels {
  static type = '[Combat] Gain Levels';
  constructor(public levels = 1) {}
}

export class SetSkill {
  static type = '[Combat] Set Skill';
  constructor(public skill: string, public slot: number) {}
}

export class SetItem {
  static type = '[Combat] Set Item';
  constructor(public item: IGameItem | undefined, public slot: number) {}
}

export class SetFood {
  static type = '[Combat] Set Food';
  constructor(public item: IGameItem | undefined, public slot: number) {}
}

export class ConsumeFoodCharges {
  static type = '[Combat] Consume Food Charges';
  constructor() {}
}

export class ChangeThreats {
  static type = '[Combat] Change Threats';
  constructor() {}
}

export class ResetCombat {
  static type = '[Combat] Reset';
  constructor() {}
}

export class ResetCombatSoft {
  static type = '[Combat] Soft Reset';
  constructor() {}
}

export class EndCombat {
  static type = '[Combat] End';
  constructor() {}
}

export class EndCombatAndResetPlayer {
  static type = '[Combat] End And Reset Player';
  constructor() {}
}

export class StartCombatEndProcess {
  static type = '[Combat] Start Combat End Process';
  constructor() {}
}

export class SetCombatDone {
  static type = '[Combat] Set Combat Done';
  constructor() {}
}

export class InitiateCombat {
  static type = '[Combat] Initiate';
  constructor(public threat: string, public shouldResetPlayer = false, public shouldExitDungeon = false) {}
}

export class SetCombatLock {
  static type = '[Combat] Set Combat Lock';
  constructor(public isLocked: boolean) {}
}

export class SetCombatLockForEnemies {
  static type = '[Combat] Set Combat Lock For Enemies';
  constructor(public isLockedForEnemies: boolean) {}
}

export class AddCombatLogMessage {
  static type = '[Combat] Add Log Message';
  constructor(public message: string) {}
}

export class LowerPlayerCooldown {
  static type = '[Combat] Lower Player Cooldown';
  constructor() {}
}

export class LowerEnemyCooldown {
  static type = '[Combat] Lower Enemy Cooldown';
  constructor(public enemyIndex: number) {}
}

export class TickPlayerEffects {
  static type = '[Combat] Tick Player Effects';
  constructor() {}
}

export class TickEnemyEffects {
  static type = '[Combat] Tick Enemy Effects';
  constructor(public enemyIndex: number) {}
}

export class EnemyTakeTurn {
  static type = '[Combat] Enemy Take Turn';
  constructor(public enemyIndex: number) {}
}

export class TargetSelfWithAbility {
  static type = '[Combat] Target Self With Ability';
  constructor(public ability: IGameCombatAbility, public abilitySlot: number, public fromItem?: IGameItem) {}
}

export class TargetEnemyWithAbility {
  static type = '[Combat] Target Enemy With Ability';
  constructor(
    public targetIndex: number,
    public source: IGameEncounterCharacter,
    public ability: IGameCombatAbility,
    public abilitySlot: number,
    public fromItem?: IGameItem
  ) {}
}

export class UseItemInSlot {
  static type = '[Combat] Use Item In Slot';
  constructor(public slot: number) {}
}

export class PlayerCooldownSkill {
  static type = '[Combat] Player Cooldown Skill';
  constructor(public slot: number, public duration: number) {}
}

export class EnemyCooldownSkill {
  static type = '[Combat] Enemy Cooldown Skill';
  constructor(public enemyIndex: number, public slot: number, public duration: number) {}
}

export class PlayerSpeedReset {
  static type = '[Combat] Player Speed Reset';
  constructor() {}
}

export class EnemySpeedReset {
  static type = '[Combat] Enemy Speed Reset';
  constructor(public enemyIndex: number) {}
}

export class DebugApplyEffectToPlayer {
  static type = '[Combat] Debug Apply Effect To Player';
  constructor(public effect: IGameStatusEffect) {}
}

export class DebugSetPlayerHealth {
  static type = '[Combat] Debug Set Player Health';
  constructor(public value: number) {}
}

export class DebugSetPlayerEnergy {
  static type = '[Combat] Debug Set Player Energy';
  constructor(public value: number) {}
}

export class OOCPlayerHeal {
  static type = '[Combat] OOC Player Heal';
  constructor(public amount: number) {}
}

export class OOCPlayerEnergy {
  static type = '[Combat] OOC Player Energy';
  constructor(public amount: number) {}
}

export class OOCEatFood {
  static type = '[Combat] OOC Eat Food';
  constructor(public item: IGameItem) {}
}

export class OOCEatFoodInDungeon {
  static type = '[Combat] OOC Eat Food In Dungeon';
  constructor(public slot: number) {}
}
