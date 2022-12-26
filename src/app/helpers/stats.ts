import { sum } from 'lodash';
import { IGameItem, ItemType, Stat } from '../../interfaces';

export function calculateStat(equipment: Partial<Record<ItemType, IGameItem>>, stat: Stat): number {
  return sum(Object.values(equipment).map((item) => item?.stats[stat] ?? 0));
}
