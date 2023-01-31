import { IGameCombatAbility, IGameEncounterCharacter, IGameEnemyThreat } from '../../interfaces';

export class SetSkill {
  static type = '[Combat] Set Skill';
  constructor(public skill: string, public slot: number) {}
}

export class ChangeThreats {
  static type = '[Combat] Change Threats';
  constructor() {}
}

export class ResetCombat {
  static type = '[Combat] Reset';
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

export class InitiateCombat {
  static type = '[Combat] Initiate';
  constructor(public threat: IGameEnemyThreat, public shouldResetPlayer = false) {}
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

export class EnemyTakeTurn {
  static type = '[Combat] Enemy Take Turn';
  constructor(public enemyIndex: number) {}
}

export class TargetSelfWithAbility {
  static type = '[Combat] Target Self With Ability';
  constructor(public ability: IGameCombatAbility, public abilitySlot: number) {}
}

export class TargetEnemyWithAbility {
  static type = '[Combat] Target Enemy With Ability';
  constructor(
    public targetIndex: number,
    public source: IGameEncounterCharacter,
    public ability: IGameCombatAbility,
    public abilitySlot: number
  ) {}
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

