

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { AchievementStat, IGameGathering, ItemType, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { DecreaseDurability } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelFishing, SetFishingLocation } from './fishing.actions';
import { attachments } from './fishing.attachments';
import { defaultFishing } from './fishing.functions';

@State<IGameGathering>({
  name: 'fishing',
  defaults: defaultFishing()
})
@Injectable()
export class FishingState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(FishingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
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
    const cdrValue = calculateStat(equipment, Stat.FishingSpeed);
    decreaseGatherTimer(ctx, ticks, cdrValue, CancelFishing, AchievementStat.GatherFishing);
  }

  @Action(SetFishingLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetFishingLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.FishingPower);
    setGatheringLocation(ctx, location, gdrValue);

    ctx.dispatch([
      new DecreaseDurability(ItemType.FishingRod),
      new DecreaseDurability(ItemType.FishingBait)
    ]);
  };

}
