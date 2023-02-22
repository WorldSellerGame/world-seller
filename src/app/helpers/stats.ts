import { get, sum } from 'lodash';
import { IGameItem, IPlayerCharacter, IStatGain, ItemType, Stat } from '../../interfaces';

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
    [Stat.Speed]: 0,

    [Stat.HealingPerRound]: 0,
    [Stat.HealingPerCombat]: 0,
    [Stat.EnergyPerRound]: 0,
    [Stat.EnergyPerCombat]: 0
  };
}

export function calculateStat(equipment: Partial<Record<ItemType, IGameItem>>, stat: Stat): number {
  return sum(Object.values(equipment).map((item) => item?.stats[stat] ?? 0));
}

export function calculateStatFromState(state: any, character: IPlayerCharacter, stat: Stat): number {
  const statGains: IStatGain[] = state.game.statGains?.[stat] ?? [];

  return statGains.reduce((total, statGain) => {
    const { levelStat, divisor } = statGain;

    let value = 0;

    if(levelStat === 'lastTotalLevel') {
      value = character.lastTotalLevel;
    } else {
      value = get(character, `skills.${levelStat}.level`, 0);
    }

    return total + Math.floor(value / divisor);
  }, 0);
}

export function calculateHealthFromState(state: any, character: IPlayerCharacter): number {
  return calculateStatFromState(state, character, Stat.HealthBonus)
       + calculateStat(character.equipment, Stat.HealthBonus);
}

export function calculateEnergyFromState(state: any, character: IPlayerCharacter): number {
  return calculateStatFromState(state, character, Stat.EnergyBonus)
       + calculateStat(character.equipment, Stat.EnergyBonus);
}

export function getStatTotals(state: any, character: IPlayerCharacter): Record<Stat, number> {
  const totals: Record<string, number> = {
    health: calculateHealthFromState(state, character),
    energy: calculateEnergyFromState(state, character)
  };

  // we don't want to calculate health/energy twice
  Object.values(Stat).forEach((stat) => {
    if(stat === Stat.HealthBonus || stat === Stat.EnergyBonus) {
      return;
    }

    totals[stat] = calculateStatFromState(state, character, stat as Stat);
  });

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
