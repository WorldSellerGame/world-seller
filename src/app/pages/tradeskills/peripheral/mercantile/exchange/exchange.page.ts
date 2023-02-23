import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AchievementStat, IGameMercantileExchange } from '../../../../../../interfaces';
import { CharSelectState, MercantileState } from '../../../../../../stores';
import { IncrementStat } from '../../../../../../stores/achievements/achievements.actions';
import { GainResources } from '../../../../../../stores/charselect/charselect.actions';
import { RotateExchangeGoods, SpendCoins, UpgradeExchange } from '../../../../../../stores/mercantile/mercantile.actions';
import {
  costMultiplierByRarity, costToSwapRarityToRarity,
  exchangeRotateCost, maxExchangeLevel, maxExchangeSizeUpgradeCost
} from '../../../../../../stores/mercantile/mercantile.functions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {

  @Select(MercantileState.exchange) exchange$!: Observable<IGameMercantileExchange>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  trackBy(index: number) {
    return index;
  }

  isExchangeMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxExchangeLevel();
  }

  exchangeUpgradeCost(currentLevel: number) {
    return maxExchangeSizeUpgradeCost(currentLevel);
  }

  canUpgradeExchange(currentCoins: number, currentLevel: number): boolean {
    if(this.isExchangeMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.exchangeUpgradeCost(currentLevel);
  }

  upgradeExchange() {
    this.store.dispatch(new UpgradeExchange());
  }

  exchangeRotateCost(currentLevel: number) {
    return exchangeRotateCost(currentLevel);
  }

  canRotateExchange(currentCoins: number, currentLevel: number): boolean {
    return currentCoins >= this.exchangeRotateCost(currentLevel);
  }

  rotateExchange() {
    this.store.dispatch(new RotateExchangeGoods());
  }

  exchangeRateForResource(costItem: string, forItem: string): { cost: number; gain: number } {
    const costResource = this.contentService.getResourceByName(costItem);
    const forResource = this.contentService.getResourceByName(forItem);

    const costRarityMultiplier = costMultiplierByRarity(costResource.rarity);
    const forRarityMultiplier = costMultiplierByRarity(forResource.rarity);

    if(forRarityMultiplier > costRarityMultiplier) {
      return { cost: costToSwapRarityToRarity(costResource.rarity, forResource.rarity), gain: 1 };
    }

    if(costRarityMultiplier > forRarityMultiplier) {
      return { cost: 1, gain: costToSwapRarityToRarity(forResource.rarity, costResource.rarity) };
    }

    return { cost: 1, gain: 1 };
  }

  costForResource(costItem: string) {
    return costMultiplierByRarity(this.contentService.getResourceByName(costItem)?.rarity) * 50;
  }

  doResourceBuy(costItem: string, multiplier = 1) {
    const costForOne = this.costForResource(costItem);

    this.store.dispatch([
      new SpendCoins(costForOne * multiplier),
      new IncrementStat(AchievementStat.MercantileExchangeBuy, multiplier),
      new GainResources({ [costItem]: multiplier })
    ]);
  }

  doResourceExchange(costItem: string, forItem: string, multiplier = 1) {
    const { cost, gain } = this.exchangeRateForResource(costItem, forItem);

    this.store.dispatch([
      new IncrementStat(AchievementStat.MercantileExchangeSwap, multiplier),
      new GainResources({ [forItem]: gain * multiplier }),
      new GainResources({ [costItem]: -cost * multiplier }, false)
    ]);
  }

}
