

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { AchievementStat, IGameGathering, ItemType, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { DecreaseDurability } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelLogging, SetLoggingLocation } from './logging.actions';
import { attachments } from './logging.attachments';
import { defaultLogging } from './logging.functions';

@State<IGameGathering>({
  name: 'logging',
  defaults: defaultLogging()
})
@Injectable()
export class LoggingState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(LoggingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
  }

  @Selector()
  static starredNodes(state: IGameGathering) {
    return state.starred || {};
  }

  @Selector()
  static currentLocation(state: IGameGathering) {
    if(!state.currentLocation) {
      return undefined;
    }

    return { location: state.currentLocation, duration: state.currentLocationDuration };
  }

  @Selector()
  static cooldowns(state: IGameGathering) {
    return state.cooldowns;
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const cdrValue = calculateStat(equipment, Stat.AxeSpeed);
    const cdrPercent = calculateStat(equipment, Stat.AxeSpeedPercent);
    const reducedValue = cdrPercent / 100;

    decreaseGatherTimer(ctx, 'logging', ticks, cdrValue, reducedValue, CancelLogging, AchievementStat.GatherLogging);
  }

  @Action(SetLoggingLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetLoggingLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.AxePower);
    const gdrPercent = calculateStat(equipment, Stat.AxePowerPercent);
    const reducedValue = (gdrPercent / 100) * location.gatherTime;

    setGatheringLocation(ctx, location, gdrValue + reducedValue, 'logging');
    ctx.dispatch(new DecreaseDurability(ItemType.Axe));
  };

}
