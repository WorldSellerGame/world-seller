/* eslint-disable @typescript-eslint/naming-convention */

import { IEnemyCharacter } from './character';
import { IGameCombatAbility, IGameEnemyThreat, IGameStatusEffect } from './combat';
import { IDungeon } from './dungeon';
import { GatheringTradeskill, IGameItem, IGameResource, IGameResourceTransform, RefiningTradeskill, TransformTradeskill } from './game';
import { IGameGatherLocation } from './gathering';
import { IGameRecipe } from './refining';

export interface IGameModStored {
  name: string;
  id: string | number;
  version: string;

  content: IGameModData;
  icons: Array<{ name: string; data: string }>;
  themes: Array<{ name: string; data: string }>;
  sounds: Record<string, string>;
}

export interface IGameMods {
  version: number;
  modioAuthToken: string;
  modioAuthTokenExpires: number;
  mods: Record<string | number, IGameModStored>;
  localMods: Array<string | number>;
}

export interface IModSearchOptions {
  query?: string;
  tags?: string[];
  offset?: number;
  limit?: number;
  sort?: string;
}

export interface IModReturnedData {
  id: number;
  name: string;
  summary: string;
  profile_url: string;

  date_updated: number;
  date_uploaded: number;

  modfile: {
    download: {
      binary_url: string;
      date_expires: number;
    };

    filesize: string;
    version: string;
  };

  submitted_by: {
    username: string;
    profile_url: string;
  };

  logo: {
    thumb_320x180: string;
  };

  stats: {
    ratings_display_text: string;
    downloads_total: number;
  };

  tags: Array<{
    name: string;
  }>;
}

export interface IModReturnedValue {
  data: IModReturnedData[];
  result_count: number;
  result_limit: number;
  result_offset: number;
  result_total: number;
}

export interface IGameModData {

  // gathering skill changes
  [GatheringTradeskill.Fishing]?: IGameGatherLocation[];
  [GatheringTradeskill.Foraging]?: IGameGatherLocation[];
  [GatheringTradeskill.Hunting]?: IGameGatherLocation[];
  [GatheringTradeskill.Logging]?: IGameGatherLocation[];
  [GatheringTradeskill.Mining]?: IGameGatherLocation[];

  // refining skill changes
  [RefiningTradeskill.Alchemy]?: IGameRecipe[];
  [RefiningTradeskill.Blacksmithing]?: IGameRecipe[];
  [RefiningTradeskill.Cooking]?: IGameRecipe[];
  [RefiningTradeskill.Jewelcrafting]?: IGameRecipe[];
  [RefiningTradeskill.Weaving]?: IGameRecipe[];

  // peripheral skill changes
  [TransformTradeskill.Farming]?: IGameResourceTransform[];
  [TransformTradeskill.Prospecting]?: IGameResourceTransform[];

  // record changes
  resources?: Record<string, IGameResource>;
  items?: Record<string, IGameItem>;
  abilities?: Record<string, IGameCombatAbility>;
  effects?: Record<string, IGameStatusEffect>;

  enemies?: Record<string, IEnemyCharacter>;
  threats?: Record<string, IGameEnemyThreat>;
  dungeons?: Record<string, IDungeon>;

  // added content
  themes?: Array<{ name: string; value: string; file: string }>;

}
