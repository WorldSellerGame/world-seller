import { sum } from 'lodash';
import { IGameItem, IPlayerCharacter, ItemType, Stat } from '../../interfaces';

export function defaultStatsZero(): Record<Stat, number> {
  return {
    [Stat.PickaxePower]: 0,
    [Stat.AxePower]: 0,
    [Stat.FishingPower]: 0,
    [Stat.ScythePower]: 0,
    [Stat.HuntingPower]: 0,

    [Stat.PickaxeSpeed]: 0,
    [Stat.AxeSpeed]: 0,
    [Stat.FishingSpeed]: 0,
    [Stat.ScytheSpeed]: 0,
    [Stat.HuntingSpeed]: 0,

    [Stat.Armor]: 0,
    [Stat.Healing]: 0,
    [Stat.Attack]: 0,
    [Stat.EnergyBonus]: 0,
    [Stat.HealthBonus]: 0,
    [Stat.Speed]: 0
  };
}

export function calculateStat(equipment: Partial<Record<ItemType, IGameItem>>, stat: Stat): number {
  return sum(Object.values(equipment).map((item) => item?.stats[stat] ?? 0));
}

export function calculateSpeedBonus(character: IPlayerCharacter): number {
  return Math.floor(character.lastTotalLevel / 25);
}

export function calculateHealingBonus(character: IPlayerCharacter): number {
  return Math.floor(character.lastTotalLevel / 20);
}

export function calculateAttackBonus(character: IPlayerCharacter): number {
  return Math.floor(character.lastTotalLevel / 15);
}

export function calculateMaxHealth(character: IPlayerCharacter): number {
  return character.lastTotalLevel + calculateStat(character.equipment, Stat.HealthBonus);
}

export function calculateMaxEnergy(character: IPlayerCharacter): number {
  return Math.floor(character.lastTotalLevel / 10) + calculateStat(character.equipment, Stat.EnergyBonus);
}

export function getStatTotals(character: IPlayerCharacter): Record<Stat, number> {
  const totals: Record<string, number> = {
    health: calculateMaxHealth(character),
    energy: calculateMaxEnergy(character),
    attack: calculateAttackBonus(character),
    healing: calculateHealingBonus(character),
    speed: calculateSpeedBonus(character)
  };

  Object.keys(character.equipment).forEach(slot => {
    const item = character.equipment[slot as ItemType];
    if(!item) {
      return;
    }

    Object.keys(item.stats).forEach(statStr => {
      const stat = statStr as Stat;
      totals[stat] = (totals[stat] || 0) + (item.stats[stat] ?? 0);
    });
  });

  if(totals['health'] < 1) {
    totals['health'] = 1;
  }

  if(totals['energy'] < 0) {
    totals['energy'] = 0;
  }

  return totals;
}
