import { IGameCombatAbilityEffect } from '../../interfaces';

export function isHealEffect(effect: IGameCombatAbilityEffect): boolean {
  return effect.effect.includes('Heal');
}
