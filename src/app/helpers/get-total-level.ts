
import { sum } from 'lodash';

export function getMercantileLevel(state: any): number {
  return state.mercantile.level
       + state.mercantile.shop.saleCounterLevel
       + state.mercantile.shop.saleBonusLevel
       + state.mercantile.shop.decorationsLevel
       + state.mercantile.stockpile.limitLevel;
}

export function getTotalLevel(state: any): number {
  let baseLevel = sum(Object.keys(state).map(key => state[key].level ?? 0));

  baseLevel += getMercantileLevel(state);

  return baseLevel;
}
