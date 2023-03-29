import { Injectable } from '@angular/core';
import { cloneDeep, merge } from 'lodash';
import * as seedrandom from 'seedrandom';

import * as abilities from '../../assets/content/abilities.json';
import * as achievements from '../../assets/content/achievements.json';
import * as alchemy from '../../assets/content/alchemy.json';
import * as blacksmithing from '../../assets/content/blacksmithing.json';
import * as cooking from '../../assets/content/cooking.json';
import * as dungeons from '../../assets/content/dungeons.json';
import * as effects from '../../assets/content/effects.json';
import * as enemies from '../../assets/content/enemies.json';
import * as farming from '../../assets/content/farming.json';
import * as fishing from '../../assets/content/fishing.json';
import * as foraging from '../../assets/content/foraging.json';
import * as hunting from '../../assets/content/hunting.json';
import * as items from '../../assets/content/items.json';
import * as jewelcrafting from '../../assets/content/jewelcrafting.json';
import * as logging from '../../assets/content/logging.json';
import * as mining from '../../assets/content/mining.json';
import * as prospecting from '../../assets/content/prospecting.json';
import * as resources from '../../assets/content/resources.json';
import * as threats from '../../assets/content/threats.json';
import * as weaving from '../../assets/content/weaving.json';

import * as characterNames from '../../assets/content/character-names.json';
import * as queueUpgrades from '../../assets/content/queue-upgrades.json';
import * as statGains from '../../assets/content/stat-gains.json';

import { Store } from '@ngxs/store';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  GameOption,
  GatheringTradeskill,
  IAchievement,
  IDungeon, IEnemyCharacter, IGameCombatAbility,
  IGameEnemyThreat, IGameGatherLocation, IGameItem,
  IGameModData, IGameModStored, IGameRecipe, IGameResource, IGameResourceTransform,
  IGameStatusEffect, IStatGains, RefiningTradeskill
} from '../../interfaces';
import { SetStatGains } from '../../stores/game/game.actions';
import { SetOption } from '../../stores/options/options.actions';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private modOldItems: Record<string, any> = {};
  private modCacheRecords: Record<string, Record<string, any>> = {
    resources: {},
    items: {},
    abilities: {},
    effects: {},
    enemies: {},
    threats: {},
    dungeons: {}
  };

  // core things
  private get resources(): Record<string, IGameResource> {
    return (resources as any).default || resources;
  }

  private get items(): Record<string, IGameItem> {
    return (items as any).default || items;
  }

  private get abilities(): Record<string, IGameCombatAbility> {
    return (abilities as any).default || abilities;
  }

  private get enemies(): Record<string, IEnemyCharacter> {
    return (enemies as any).default || enemies;
  }

  private get threats(): Record<string, IGameEnemyThreat> {
    return (threats as any).default || threats;
  }

  private get effects(): Record<string, IGameStatusEffect> {
    return (effects as any).default || effects;
  }

  private get dungeons(): Record<string, IDungeon> {
    return (dungeons as any).default || dungeons;
  }

  private get achievements(): Record<string, any> {
    return (achievements as any).default || achievements;
  }

  // other skills
  private get alchemy(): { recipes: IGameRecipe[] } {
    return (alchemy as any).default || alchemy;
  }

  private get blacksmithing(): { recipes: IGameRecipe[] } {
    return (blacksmithing as any).default || blacksmithing;
  }

  private get cooking(): { recipes: IGameRecipe[] } {
    return (cooking as any).default || cooking;
  }

  private get farming(): { transforms: IGameResourceTransform[] } {
    return (farming as any).default || farming;
  }

  private get fishing(): { locations: IGameGatherLocation[] } {
    return (fishing as any).default || fishing;
  }

  private get foraging(): { locations: IGameGatherLocation[] } {
    return (foraging as any).default || foraging;
  }

  private get hunting(): { locations: IGameGatherLocation[] } {
    return (hunting as any).default || hunting;
  }

  private get jewelcrafting(): { recipes: IGameRecipe[] } {
    return (jewelcrafting as any).default || jewelcrafting;
  }

  private get logging(): { locations: IGameGatherLocation[] } {
    return (logging as any).default || logging;
  }

  private get mining(): { locations: IGameGatherLocation[] } {
    return (mining as any).default || mining;
  }

  private get prospecting(): { transforms: IGameResourceTransform[] } {
    return (prospecting as any).default || prospecting;
  }

  private get weaving(): { recipes: IGameRecipe[] } {
    return (weaving as any).default || weaving;
  }

  // misc
  public get characterNames() {
    return (characterNames as any).default || characterNames;
  }

  public get statGains(): IStatGains {
    return (statGains as any).default || statGains;
  }

  public get queueUpgrades() {
    return (queueUpgrades as any).default || queueUpgrades;
  }

  // aggregates
  public readonly locationHashes: Record<GatheringTradeskill, Record<string, IGameGatherLocation>> = {
    [GatheringTradeskill.Fishing]: {},
    [GatheringTradeskill.Foraging]: {},
    [GatheringTradeskill.Hunting]: {},
    [GatheringTradeskill.Logging]: {},
    [GatheringTradeskill.Mining]: {}
  };

  public readonly recipeHashes: Record<RefiningTradeskill, Record<string, IGameRecipe>> = {
    [RefiningTradeskill.Alchemy]: {},
    [RefiningTradeskill.Blacksmithing]: {},
    [RefiningTradeskill.Cooking]: {},
    [RefiningTradeskill.Jewelcrafting]: {},
    [RefiningTradeskill.Weaving]: {}
  };

  private soundEffectOverrides: Record<string, string> = {};

  constructor(private store: Store, private svgRegistry: SvgIconRegistryService) {
    this.init();
  }

  private init() {
    this.locationHashes.fishing = this.toHash(this.fishing.locations, 'name');
    this.locationHashes.foraging = this.toHash(this.foraging.locations, 'name');
    this.locationHashes.hunting = this.toHash(this.hunting.locations, 'name');
    this.locationHashes.logging = this.toHash(this.logging.locations, 'name');
    this.locationHashes.mining = this.toHash(this.mining.locations, 'name');

    this.recipeHashes.alchemy = this.toHash(this.alchemy.recipes, 'result');
    this.recipeHashes.blacksmithing = this.toHash(this.blacksmithing.recipes, 'result');
    this.recipeHashes.cooking = this.toHash(this.cooking.recipes, 'result');
    this.recipeHashes.jewelcrafting = this.toHash(this.jewelcrafting.recipes, 'result');
    this.recipeHashes.weaving = this.toHash(this.weaving.recipes, 'result');

    this.loadIcons();

    // wait for @@INIT to finish
    setTimeout(() => {
      this.store.dispatch(new SetStatGains(this.statGains));
    }, 0);
  }

  private loadIcons() {
    const icons: Set<string> = new Set();

    [
      'settings', 'level', 'resources', 'inventory', 'equipment', 'time', 'messages',
      'dungeon-tile', 'dungeon-wall', 'dungeon-heal', 'dungeon-stairs', 'dungeon-chest', 'me',
      'fishing', 'foraging', 'hunting', 'logging', 'mining',
      'alchemy', 'blacksmithing', 'cooking', 'jewelcrafting', 'weaving',
      'farming', 'prospecting', 'combat', 'mercantile'
    ].forEach(x => icons.add(x));

    Object.values(this.abilities).forEach(x => icons.add(x.icon));
    Object.values(this.enemies).forEach(x => icons.add(x.icon));
    Object.values(this.threats).forEach(x => icons.add(x.icon));
    Object.values(this.effects).forEach(x => icons.add(x.icon));
    Object.values(this.dungeons).forEach(x => icons.add(x.icon));
    Object.values(this.achievements).forEach(x => icons.add(x.icon));
    Object.values(this.resources).forEach(x => icons.add(x.icon));
    Object.values(this.items).forEach(x => icons.add(x.icon));

    Array.from(icons).forEach(icon => this.loadSVGFromURL(icon, `assets/icon/${icon}.svg`));
  }

  private toHash(arr: any[], key: string) {
    return arr.reduce((hash, item) => {
      hash[item[key]] = item;
      return hash;
    }, {});
  }

  private getRandom<T>(rng: any, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
  }

  public loadSVGFromURL(name: string, url: string) {
    this.svgRegistry.loadSvg(url, name)?.subscribe();
  }

  public loadSVGFromString(name: string, svg: string) {
    this.svgRegistry.addSvg(name, svg);
  }

  public getCharacterNameFromSeed(seed: number) {
    const rng = seedrandom('character' + seed.toString());

    const firstKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);
    const secondKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);

    const firstName = this.getRandom(rng, this.characterNames.human[firstKey]);
    const secondName = this.getRandom(rng, this.characterNames.human[secondKey]);

    return `${firstName} ${secondName}`;
  }

  public isResource(name: string): boolean {
    return !!this.getResourceByName(name);
  }

  public isItem(name: string): boolean {
    return !!this.getItemByName(name);
  }

  public getAchievementByName(name: string): IAchievement {
    return cloneDeep(this.achievements[name]);
  }

  public getAllAchievements(): Record<string, IAchievement> {
    return cloneDeep(this.achievements);
  }

  // mod functions
  public loadMod(storedMod: IGameModStored) {
    const existingMod = this.store.snapshot().mods.mods[storedMod.id];
    if(existingMod) {
      this.unloadMod(existingMod);
    }

    const mod = storedMod.content;
    const icons = storedMod.icons;
    const themes = storedMod.themes || [];
    const sounds = storedMod.sounds || {};

    Object.keys(sounds).forEach(sound => {
      this.formatModSound(sound, sounds[sound]);
    });

    icons.forEach(icon => {
      this.loadSVGFromString(icon.name, icon.data);
    });

    themes.forEach(theme => {
      document.getElementById(`theme-${theme.name}`)?.remove();

      const themeEl = document.createElement('style');
      themeEl.id = `theme-${theme.name}`;
      themeEl.textContent = theme.data.toString();

      document.head.appendChild(themeEl);
    });

    // load gathering stuff
    Object.values(GatheringTradeskill).forEach(tradeskill => {
      const locations = mod[tradeskill];
      if(!locations) {
        return;
      }

      const addLocation = (location: IGameGatherLocation) => {
        this.locationHashes[tradeskill][location.name] = location;
      };

      locations.forEach(location => {
        const oldLocation = this.locationHashes[tradeskill][location.name];
        if(oldLocation) {
          this.cacheOldModOverwrittenItem(location.name, oldLocation);
        }

        addLocation(location);
      });
    });

    // load refining stuff
    Object.values(RefiningTradeskill).forEach(tradeskill => {
      const recipes = mod[tradeskill];
      if(!recipes) {
        return;
      }

      const addRecipe = (recipe: IGameRecipe) => {
        this.recipeHashes[tradeskill][recipe.result] = recipe;
      };

      recipes.forEach(recipe => {
        const oldRecipe = this.recipeHashes[tradeskill][recipe.result];
        if(oldRecipe) {
          this.cacheOldModOverwrittenItem(recipe.result, oldRecipe);
        }

        addRecipe(recipe);
      });
    });

    ['resources', 'items', 'abilities', 'effects', 'enemies', 'threats', 'dungeons'].forEach(key => {
      const data = mod[key as keyof IGameModData] as Record<string, any>;
      if(!data) {
        return;
      }

      this.modCacheRecords[key] = this.modCacheRecords[key] || {};

      Object.keys(data).forEach(name => {
        this.modCacheRecords[key][name] = data[name];
      });
    });
  }

  public unloadMod(mod: IGameModStored) {

    // unload gathering stuff
    Object.values(GatheringTradeskill).forEach(tradeskill => {
      const locations = mod.content[tradeskill];
      if(!locations) {
        return;
      }

      locations.forEach(location => {
        const oldLocation = this.modOldItems[location.name];
        if(oldLocation) {
          this.locationHashes[tradeskill][location.name] = oldLocation;
          this.uncacheOldItem(location.name);
        } else {
          delete this.locationHashes[tradeskill][location.name];
        }
      });
    });

    // unload refining stuff
    Object.values(RefiningTradeskill).forEach(tradeskill => {
      const recipes = mod.content[tradeskill];
      if(!recipes) {
        return;
      }

      recipes.forEach(recipe => {
        const oldRecipe = this.modOldItems[recipe.result];
        if(oldRecipe) {
          this.recipeHashes[tradeskill][recipe.result] = oldRecipe;
          this.uncacheOldItem(recipe.result);
        } else {
          delete this.recipeHashes[tradeskill][recipe.result];
        }
      });
    });

    ['resources', 'items', 'abilities', 'effects', 'enemies', 'threats', 'dungeons'].forEach(key => {
      const data = mod.content[key as keyof IGameModStored['content']] as Record<string, any>;
      if(!data) {
        return;
      }

      this.modCacheRecords[key] = this.modCacheRecords[key] || {};

      Object.keys(data).forEach(name => {
        delete this.modCacheRecords[key][name];
      });
    });

    // unload sounds
    Object.keys(mod.sounds || {}).forEach(sound => {
      delete this.soundEffectOverrides[sound];
    });

    // unload themes
    mod?.themes?.forEach(theme => {
      const themeEl = document.getElementById(`theme-${theme.name}`);
      themeEl?.remove();

      // reset theme if we're unloading a theme we're currently using
      const isUsingTheme = document.getElementsByClassName(`theme-${theme.name}`).length > 0;
      if(isUsingTheme) {
        this.store.dispatch(new SetOption(GameOption.ColorTheme, 'worldseller'));
      }
    });
  }

  // cache an item that's being overwritten so we can restore it later
  private cacheOldModOverwrittenItem(name: string, item: any) {

    // we can only cache stuff once
    if(this.modOldItems[name]) {
      return;
    }

    this.modOldItems[name] = item;
  }

  private uncacheOldItem(name: string) {
    delete this.modOldItems[name];
  }

  private formatModSound(soundName: string, soundString: string) {
    this.soundEffectOverrides[soundName] = `data:audio/wav;base64,${soundString}`;
  }

  public getOverrideSoundEffect(name: string): string | undefined {
    return this.soundEffectOverrides[name];
  }

  // mod-enabled getters

  // misc
  public getResourceByName(name: string): IGameResource {
    const resource = this.modCacheRecords['resources'][name] || this.resources[name];
    return cloneDeep(resource);
  }

  public getItemByName(name: string): IGameItem {
    const item = this.modCacheRecords['items'][name] || this.items[name];
    return cloneDeep(item);
  }

  public getAbilityByName(name: string): IGameCombatAbility {
    const ability = this.modCacheRecords['abilities'][name] || this.abilities[name];
    return cloneDeep(ability);
  }

  public getEnemyByName(name: string): IEnemyCharacter {
    const enemy = this.modCacheRecords['enemies'][name] || this.enemies[name];
    return cloneDeep(enemy);
  }

  public getThreatByName(name: string): IGameEnemyThreat {
    const threat = this.modCacheRecords['threats'][name] || this.threats[name];
    return cloneDeep(threat);
  }

  public getEffectByName(name: string): IGameStatusEffect {
    const effect = this.modCacheRecords['effects'][name] || this.effects[name];
    return cloneDeep(effect);
  }

  public getDungeonByName(name: string): IDungeon {
    const dungeon = this.modCacheRecords['dungeons'][name] || this.dungeons[name];
    return cloneDeep(dungeon);
  }

  public getAllResources(): Record<string, IGameResource> {
    return cloneDeep(merge({}, this.resources, this.modCacheRecords['resources']));
  }

  public getAllItems(): Record<string, IGameItem> {
    return cloneDeep(merge({}, this.items, this.modCacheRecords['items']));
  }

  public getAllThreats(): Record<string, IGameEnemyThreat> {
    return cloneDeep(merge({}, this.threats, this.modCacheRecords['threats']));
  }

  public getAllDungeons(): Record<string, IDungeon> {
    return cloneDeep(merge({}, this.dungeons, this.modCacheRecords['dungeons']));
  }

  public getAllAbilities(): Record<string, IGameCombatAbility> {
    return cloneDeep(merge({}, this.abilities, this.modCacheRecords['abilities']));
  }

  // refining
  public getAlchemyRecipes(): IGameRecipe[] {
    return cloneDeep(Object.values(this.recipeHashes.alchemy));
  }

  public getBlacksmithingRecipes(): IGameRecipe[] {
    return cloneDeep(Object.values(this.recipeHashes.blacksmithing));
  }

  public getCookingRecipes(): IGameRecipe[] {
    return cloneDeep(Object.values(this.recipeHashes.cooking));
  }

  public getJewelcraftingRecipes(): IGameRecipe[] {
    return cloneDeep(Object.values(this.recipeHashes.jewelcrafting));
  }

  public getWeavingRecipes(): IGameRecipe[] {
    return cloneDeep(Object.values(this.recipeHashes.weaving));
  }

  // gathering
  public getFishingLocations(): IGameGatherLocation[] {
    return cloneDeep(Object.values(this.locationHashes.fishing));
  }

  public getForagingLocations(): IGameGatherLocation[] {
    return cloneDeep(Object.values(this.locationHashes.foraging));
  }

  public getHuntingLocations(): IGameGatherLocation[] {
    return cloneDeep(Object.values(this.locationHashes.hunting));
  }

  public getLoggingLocations(): IGameGatherLocation[] {
    return cloneDeep(Object.values(this.locationHashes.logging));
  }

  public getMiningLocations(): IGameGatherLocation[] {
    return cloneDeep(Object.values(this.locationHashes.mining));
  }

  // peripheral
  public getFarmingTransforms(): IGameResourceTransform[] {
    return cloneDeep(this.farming.transforms);
  }

  public getProspectingTransforms(): IGameResourceTransform[] {
    return cloneDeep(this.prospecting.transforms);
  }
}
