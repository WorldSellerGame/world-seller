import { mapValues } from 'lodash';
import { IGameItem, Rarity, Stat } from '../../interfaces';

export function getItemRarityClass(item: IGameItem): string {
  if(item.durability <= 0) {
    return Rarity.Broken.toLowerCase();
  }

  return (item.rarity || Rarity.Common).toLowerCase();
}

export function itemValue(item: IGameItem, multiplier = 1): number {
  return multiplier * (item.quantity ?? 1) * (item.value ?? 1) * (item.durability <= 0 ? 0.2 : 1);
}

export function calculateBrokenItemStats(item: IGameItem): Record<Stat, number> {
  return mapValues(item.stats, (value) => Math.floor(value / 2));
}
