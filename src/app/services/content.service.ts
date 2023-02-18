import { Injectable } from '@angular/core';
import * as seedrandom from 'seedrandom';

import * as abilities from '../../assets/content/abilities.json';
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

import { cloneDeep } from 'lodash';
import * as characterNames from '../../assets/content/character-names.json';
import * as statGains from '../../assets/content/stat-gains.json';

import { Store } from '@ngxs/store';
import {
  IDungeon, IEnemyCharacter, IGameCombatAbility,
  IGameEnemyThreat, IGameItem, IGameResource, IGameStatusEffect
} from '../../interfaces';
import { SetStatGains } from '../../stores/game/game.actions';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

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

  // other skills
  public get alchemy() {
    return (alchemy as any).default || alchemy;
  }

  public get blacksmithing() {
    return (blacksmithing as any).default || blacksmithing;
  }

  public get cooking() {
    return (cooking as any).default || cooking;
  }

  public get farming() {
    return (farming as any).default || farming;
  }

  public get fishing() {
    return (fishing as any).default || fishing;
  }

  public get foraging() {
    return (foraging as any).default || foraging;
  }

  public get hunting() {
    return (hunting as any).default || hunting;
  }

  public get jewelcrafting() {
    return (jewelcrafting as any).default || jewelcrafting;
  }

  public get logging() {
    return (logging as any).default || logging;
  }

  public get mining() {
    return (mining as any).default || mining;
  }

  public get prospecting() {
    return (prospecting as any).default || prospecting;
  }

  public get weaving() {
    return (weaving as any).default || weaving;
  }

  // misc
  public get characterNames() {
    return (characterNames as any).default || characterNames;
  }

  public get statGains() {
    return (statGains as any).default || statGains;
  }

  // aggregates
  public readonly locationHashes = {
    fishing: {},
    foraging: {},
    hunting: {},
    logging: {},
    mining: {}
  };

  public readonly recipeHashes = {
    alchemy: {},
    blacksmithing: {},
    cooking: {},
    jewelcrafting: {},
    weaving: {}
  };

  constructor(private store: Store) {
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

    // wait for @@INIT to finish
    setTimeout(() => {
      this.store.dispatch(new SetStatGains(this.statGains));
    }, 0);
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

  public getCharacterNameFromSeed(seed: number) {
    const rng = seedrandom('character' + seed.toString());

    const firstKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);
    const secondKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);

    const firstName = this.getRandom(rng, this.characterNames.human[firstKey]);
    const secondName = this.getRandom(rng, this.characterNames.human[secondKey]);

    return `${firstName} ${secondName}`;
  }

  public getLocationsForSkill(skill: keyof typeof this.locationHashes) {
    return this.locationHashes[skill];
  }

  public getRecipesForSkill(skill: keyof typeof this.recipeHashes) {
    return this.recipeHashes[skill];
  }

  public getResourceByName(name: string) {
    return cloneDeep(this.resources[name]);
  }

  public getItemByName(name: string) {
    return cloneDeep(this.items[name]);
  }

  public getAllAbilities() {
    return cloneDeep(this.abilities);
  }

  public getAbilityByName(name: string) {
    return cloneDeep(this.abilities[name]);
  }

  public getEnemyByName(name: string) {
    return cloneDeep(this.enemies[name]);
  }

  public getAllThreats() {
    return cloneDeep(this.threats);
  }

  public getThreatByName(name: string) {
    return cloneDeep(this.threats[name]);
  }

  public getEffectByName(name: string) {
    return cloneDeep(this.effects[name]);
  }

  public getAllDungeons() {
    return cloneDeep(this.dungeons);
  }

  public getDungeonByName(name: string) {
    return cloneDeep(this.dungeons[name]);
  }

}
