import { IGameCombatActionEffect } from '../../interfaces';

export function isHealEffect(effect: IGameCombatActionEffect): boolean {
  return effect.effect.includes('Heal');
}
