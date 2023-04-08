

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { AchievementStat, GatheringTradeskill, IGameGathering, ItemType, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { DecreaseDurability } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelHunting, SetHuntingLocation } from './hunting.actions';
import { attachments } from './hunting.attachments';
import { defaultHunting } from './hunting.functions';

@State<IGameGathering>({
  name: 'hunting',
  defaults: defaultHunting()
})
@Injectable()
export class HuntingState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(HuntingState, action, handler);
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
    const cdrValue = calculateStat(equipment, Stat.HuntingSpeed);
    const cdrPercent = calculateStat(equipment, Stat.HuntingSpeedPercent);
    const reducedValue = cdrPercent / 100;

    decreaseGatherTimer(ctx, GatheringTradeskill.Hunting, ticks, cdrValue, reducedValue, CancelHunting, AchievementStat.GatherHunting);
  }

  @Action(SetHuntingLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetHuntingLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.HuntingPower);
    const gdrPercent = calculateStat(equipment, Stat.HuntingPowerPercent);
    const reducedValue = (gdrPercent / 100) * location.gatherTime;

    setGatheringLocation(ctx, location, gdrValue + reducedValue, GatheringTradeskill.Hunting);
    ctx.dispatch(new DecreaseDurability(ItemType.HuntingTool));
  };

}
