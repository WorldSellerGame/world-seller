import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OptionsState } from '../../stores';
import { GainAlchemyLevels } from '../../stores/alchemy/alchemy.actions';
import { GainBlacksmithingLevels } from '../../stores/blacksmithing/blacksmithing.actions';
import { DiscoverResourceOrItem, GainItemOrResource } from '../../stores/charselect/charselect.actions';
import { DebugApplyEffectToPlayer, GainCombatLevels, InitiateCombat } from '../../stores/combat/combat.actions';
import { GainCookingLevels } from '../../stores/cooking/cooking.actions';
import { GainFarmingLevels } from '../../stores/farming/farming.actions';
import { GainFishingLevels } from '../../stores/fishing/fishing.actions';
import { GainForagingLevels } from '../../stores/foraging/foraging.actions';
import { GainHuntingLevels } from '../../stores/hunting/hunting.actions';
import { GainJewelcraftingLevels } from '../../stores/jewelcrafting/jewelcrafting.actions';
import { GainLoggingLevels } from '../../stores/logging/logging.actions';
import { GainMercantileLevels } from '../../stores/mercantile/mercantile.actions';
import { GainMiningLevels } from '../../stores/mining/mining.actions';
import { GainProspectingLevels } from '../../stores/prospecting/prospecting.actions';
import { GainWeavingLevels } from '../../stores/weaving/weaving.actions';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  @Select(OptionsState.isDebugMode) debugMode$!: Observable<boolean>;

  constructor(private store: Store, private contentService: ContentService) { }

  init() {
    this.debugMode$.subscribe(isDebugMode => {
      if(!isDebugMode) {
        this.disableDebugFunctions();
        return;
      }

      this.enableDebugFunctions();
    });
  }

  enableDebugFunctions() {
    (window as any).gainItem = (item: string, amount: number) => {
      this.store.dispatch(new GainItemOrResource(item, amount));
    };

    (window as any).discover = (item: string) => {
      this.store.dispatch(new DiscoverResourceOrItem(item));
    };

    (window as any).fightThreat = (threat: string) => {
      this.store.dispatch(new InitiateCombat(threat, true));
    };

    (window as any).applyCombatEffectToPlayer = (effect: string) => {
      const effectRef = this.contentService.getEffectByName(effect);
      if(!effectRef) {
        console.error(`Could not find effect ${effect}!`);
        return;
      }

      this.store.dispatch(new DebugApplyEffectToPlayer(effectRef));
    };

    (window as any).gainLevel = (tradeskill: string, levels = 1) => {
      switch(tradeskill.toLowerCase()) {
        case 'alchemy':       return this.store.dispatch(new GainAlchemyLevels(levels));
        case 'blacksmithing': return this.store.dispatch(new GainBlacksmithingLevels(levels));
        case 'combat':        return this.store.dispatch(new GainCombatLevels(levels));
        case 'cooking':       return this.store.dispatch(new GainCookingLevels(levels));
        case 'farming':       return this.store.dispatch(new GainFarmingLevels(levels));
        case 'fishing':       return this.store.dispatch(new GainFishingLevels(levels));
        case 'foraging':      return this.store.dispatch(new GainForagingLevels(levels));
        case 'hunting':       return this.store.dispatch(new GainHuntingLevels(levels));
        case 'jewelcrafting': return this.store.dispatch(new GainJewelcraftingLevels(levels));
        case 'logging':       return this.store.dispatch(new GainLoggingLevels(levels));
        case 'mercantile':    return this.store.dispatch(new GainMercantileLevels(levels));
        case 'mining':        return this.store.dispatch(new GainMiningLevels(levels));
        case 'prospecting':   return this.store.dispatch(new GainProspectingLevels(levels));
        case 'weaving':       return this.store.dispatch(new GainWeavingLevels(levels));
        default: console.error(`Could not find tradeskill ${tradeskill}!`);
      }

      return;
    };
  }

  disableDebugFunctions() {
    (window as any).gainItem = () => {};
    (window as any).discover = () => {};
    (window as any).fightThreat = () => {};
    (window as any).applyCombatEffectToPlayer = () => {};
    (window as any).gainLevel = () => {};
  }
}
