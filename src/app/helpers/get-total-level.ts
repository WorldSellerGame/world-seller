
import { sum } from 'lodash';

export function getTotalLevel(state: any): number {
  return sum(Object.keys(state).map(key => state[key].level ?? 0));
}
