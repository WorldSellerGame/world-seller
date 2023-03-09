import { IEnemyCharacter } from './character';
import { IGameCombatAbility, IGameEnemyThreat, IGameStatusEffect } from './combat';
import { IDungeon } from './dungeon';
import { GatheringTradeskill, IGameItem, IGameResource, IGameResourceTransform, RefiningTradeskill, TransformTradeskill } from './game';
import { IGameGatherLocation } from './gathering';
import { IGameRecipe } from './refining';

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

}
