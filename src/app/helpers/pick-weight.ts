import { countBy, sample } from 'lodash';
import { IWeighted } from '../../interfaces';

export function pickWithWeights(choices: IWeighted[], totalToTake = 1): Record<string, number> {
  const chooseableChoices = choices.map(choice => Array(choice.weight).fill(choice.name)).flat();
  return countBy(Array(totalToTake).fill(0).map(() => sample(chooseableChoices)));
}
