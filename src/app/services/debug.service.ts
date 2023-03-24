import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GatheringTradeskill, OtherTradeskill, RefiningTradeskill, Tradeskill, TransformTradeskill } from '../../interfaces';
import { OptionsState } from '../../stores';
import { GainAlchemyLevels } from '../../stores/alchemy/alchemy.actions';
import { GainBlacksmithingLevels } from '../../stores/blacksmithing/blacksmithing.actions';
import { DiscoverResourceOrItem, GainItemOrResource } from '../../stores/charselect/charselect.actions';
import {
  DebugApplyEffectToPlayer, DebugSetPlayerEnergy,
  DebugSetPlayerHealth, GainCombatLevels, InitiateCombat
} from '../../stores/combat/combat.actions';
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

    (window as any).setCombatHealth = (value: number) => {
      this.store.dispatch(new DebugSetPlayerHealth(value));
    };

    (window as any).setCombatEnergy = (value: number) => {
      this.store.dispatch(new DebugSetPlayerEnergy(value));
    };

    (window as any).applyCombatEffectToPlayer = (effect: string) => {
      const effectRef = this.contentService.getEffectByName(effect);
      if(!effectRef) {
        console.error(`Could not find effect ${effect}!`);
        return;
      }

      this.store.dispatch(new DebugApplyEffectToPlayer(effectRef));
    };

    (window as any).gainLevel = (tradeskill: Tradeskill, levels = 1) => {

      const actionsPerTradeskill: Record<Tradeskill, any> = {
        [RefiningTradeskill.Alchemy]:       GainAlchemyLevels,
        [RefiningTradeskill.Blacksmithing]: GainBlacksmithingLevels,
        [OtherTradeskill.Combat]:           GainCombatLevels,
        [RefiningTradeskill.Cooking]:       GainCookingLevels,
        [TransformTradeskill.Farming]:      GainFarmingLevels,
        [GatheringTradeskill.Fishing]:      GainFishingLevels,
        [GatheringTradeskill.Foraging]:     GainForagingLevels,
        [GatheringTradeskill.Hunting]:      GainHuntingLevels,
        [RefiningTradeskill.Jewelcrafting]: GainJewelcraftingLevels,
        [GatheringTradeskill.Logging]:      GainLoggingLevels,
        [OtherTradeskill.Mercantile]:       GainMercantileLevels,
        [GatheringTradeskill.Mining]:       GainMiningLevels,
        [TransformTradeskill.Prospecting]:  GainProspectingLevels,
        [RefiningTradeskill.Weaving]:       GainWeavingLevels
      };

      this.store.dispatch(new actionsPerTradeskill[tradeskill](levels));
    };
  }

  disableDebugFunctions() {
    (window as any).gainItem = () => {};
    (window as any).discover = () => {};
    (window as any).fightThreat = () => {};
    (window as any).applyCombatEffectToPlayer = () => {};
    (window as any).gainLevel = () => {};
    (window as any).setCombatHealth = () => {};
    (window as any).setCombatEnergy = () => {};
  }
}
