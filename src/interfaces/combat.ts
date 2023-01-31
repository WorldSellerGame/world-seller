import { Stat } from './game';

export interface IGameEnemyThreat {
  name: string;
  icon: string;
  description: string;
  maxSkillGainLevel: number;

  level: { min: number; max: number };

  enemies: string[];
}

export interface IGameEncounterDrop {
  resource?: string;
  item?: string;

  amount: number;
}

export interface IGameEncounterCharacter {
  name: string;
  icon: string;
  stats: Record<Stat, number>;
  abilities: string[];
  currentHealth: number;
  maxHealth: number;
  currentEnergy: number;
  maxEnergy: number;
  currentSpeed: number;

  idleChance: number;
  drops: IGameEncounterDrop[];

  // slot:cooldown turns
  cooldowns: Record<number, number>;
}

export interface IGameEncounter {
  enemies: IGameEncounterCharacter[];
  shouldResetPlayer: boolean;
  shouldGiveSkillPoint: boolean;
  isLocked: boolean;
  isLockedForEnemies: boolean;
  log: string[];
}

export interface IGameDungeon {
  layout: any;
}

export enum CombatAbilityTarget {
  Single = 'Single',
  Self = 'Self',
  AllEnemies = 'AllEnemies',
  Ally = 'Ally',
  All = 'All'
}

export enum CombatSkillType {
  Physical = 'Physical',
  Magical = 'Magical',
}

export interface IGameCombatAbility {
  name: string;
  description: string;
  icon: string;
  target: CombatAbilityTarget;
  type: CombatSkillType;
  stats: Array<{ stat: Stat; multiplier: number; variance: number }>;
  effect: string;
  multiplier: number;
  cooldown: number;
  energyCost: number;
  requires: Record<string, number>;
  replaces?: string;
}

export interface IGameCombat {
  version: number;
  level: number;

  currentPlayer?: IGameEncounterCharacter;
  currentEncounter?: IGameEncounter;
  currentDungeon?: IGameDungeon;
  activeSkills: string[];

  threatChangeTicks: number;
  threats: string[];
}

export interface IAttackParams {
  ability: IGameCombatAbility;
  source: IGameEncounterCharacter;
  target: IGameEncounterCharacter;
}

export interface ICombatDelta {
  target: 'target' | 'source';
  attribute: string;
  delta: number;
}
