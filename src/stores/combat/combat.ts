

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { merge, random, sample } from 'lodash';
import {
  applyDeltas, calculateStatFromState, defaultStatsZero,
  dispatchCorrectCombatEndEvent,
  findUniqueTileInDungeonFloor,
  getCombatFunction,
  getPlayerCharacterReadyForCombat, handleCombatEnd, hasAnyoneWonCombat, isDead, isHealEffect
} from '../../app/helpers';
import { ContentService } from '../../app/services/content.service';
import { VisualsService } from '../../app/services/visuals.service';
import {
  AchievementStat,
  CombatAbilityTarget, DungeonTile, ICombatDelta, IGameCombat, IGameCombatAbility,
  IGameCombatAbilityEffect,
  IGameEncounter, IGameEncounterCharacter, IGameEncounterDrop, Stat
} from '../../interfaces';
import { IncrementStat } from '../achievements/achievements.actions';
import { PlaySFX, TickTimer, UpdateAllItems } from '../game/game.actions';
import {
  AddCombatLogMessage, ChangeThreats, EnemyCooldownSkill,
  EnemySpeedReset, EnemyTakeTurn, InitiateCombat,
  LowerEnemyCooldown, PlayerCooldownSkill,
  PlayerSpeedReset, SetCombatLock, TargetEnemyWithAbility, TargetSelfWithAbility, TickEnemyEffects, TickPlayerEffects
} from './combat.actions';
import { attachments } from './combat.attachments';
import {
  acquireItemDrops,
  defaultCombat
} from './combat.functions';
import { EnterDungeon } from './dungeon.actions';

@State<IGameCombat>({
  name: 'combat',
  defaults: defaultCombat()
})
@Injectable()
export class CombatState {

  constructor(private store: Store, private contentService: ContentService, private visuals: VisualsService) {
    attachments.forEach(({ action, handler }) => {
      attachAction(CombatState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameCombat) {
    return state.level;
  }

  @Selector()
  static activeSkills(state: IGameCombat) {
    return state.activeSkills;
  }

  @Selector()
  static activeItems(state: IGameCombat) {
    return state.activeItems;
  }

  @Selector()
  static activeFoods(state: IGameCombat) {
    return state.activeFoods;
  }

  @Selector()
  static currentPlayer(state: IGameCombat) {
    return state.currentPlayer;
  }

  @Selector()
  static currentDungeon(state: IGameCombat) {
    return state.currentDungeon;
  }

  @Selector()
  static currentEncounter(state: IGameCombat) {
    if(!state.currentEncounter) {
      return undefined;
    }

    return { encounter: state.currentEncounter, player: state.currentPlayer };
  }

  @Selector()
  static threatInfo(state: IGameCombat) {
    return { threats: state.threats, threatChangeTicks: state.threatChangeTicks };
  }

  private emitDamageNumber(target: IGameEncounterCharacter, combat: IGameCombat, value: number) {
    let slot = '';

    if(target === combat.currentPlayer) {
      slot = 'player';
    }

    if(combat.currentEncounter) {
      const index = combat.currentEncounter.enemies.findIndex(x => x === target);
      if(index !== -1) {
        slot = `enemy-${index}`;
      }
    }

    if(slot) {
      this.visuals.emitDamageNumber(slot, value);
    }
  }

  @Action(UpdateAllItems)
  async updateAllItems(ctx: StateContext<IGameCombat>) {
    const state = ctx.getState();

    const activeItems = (state.activeItems || []).map(item => {
      if(!item) {
        return undefined;
      }

      const baseItem = this.contentService.getItemByName(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return merge({}, baseItem, item);
    }).filter(Boolean);

    const activeFoods = state.activeFoods.map(item => {
      if(!item) {
        return undefined;
      }

      const baseItem = this.contentService.getItemByName(item.internalId || '');
      if(!baseItem) {
        return undefined;
      }

      return merge({}, baseItem, item);
    }).filter(Boolean);

    ctx.setState(patch<IGameCombat>({ activeItems, activeFoods }));
  }

  @Action(InitiateCombat)
  initiateCombat(ctx: StateContext<IGameCombat>, { threat, shouldResetPlayer, shouldExitDungeon }: InitiateCombat) {
    const store = this.store.snapshot();
    const state = ctx.getState();

    const threatData = this.contentService.getThreatByName(threat);

    // we need the active player to exist. it always will. probably?
    const activePlayer = store.charselect.characters[store.charselect.currentCharacter];
    if(!activePlayer) {
      return;
    }

    // use either the current player, or create a new one for combat
    let currentPlayer = ctx.getState().currentPlayer;
    if(!currentPlayer) {
      currentPlayer = getPlayerCharacterReadyForCombat(store, ctx, activePlayer);
    }

    // do on-combat-start heals
    currentPlayer.currentHealth = Math.min(
      currentPlayer.currentHealth + currentPlayer.stats[Stat.HealingPerCombat],
      currentPlayer.maxHealth
    );

    currentPlayer.currentEnergy = Math.min(
      currentPlayer.currentEnergy + currentPlayer.stats[Stat.EnergyPerCombat],
      currentPlayer.maxEnergy
    );

    // sync things in case we have a persistent character
    currentPlayer.stats[Stat.Speed] = calculateStatFromState(
      store, activePlayer, Stat.Speed
    );

    // set up enemies for combat
    const enemyNamesAndCounts: Record<string, number> = {};

    const enemies: IGameEncounterCharacter[] = threatData.enemies.map(enemyName => {
      const enemyData = this.contentService.getEnemyByName(enemyName);

      enemyNamesAndCounts[enemyData.name] ??= 0;
      enemyNamesAndCounts[enemyData.name]++;

      const stats = merge(defaultStatsZero(), enemyData.stats);

      const drops: IGameEncounterDrop[] = enemyData.drops
        .filter(drop => random(1, 100) <= drop.chance)
        .map(drop => ({
          resource: drop.resource,
          item: drop.item,
          amount: random(drop.min, drop.max)
        }));

      return {
        name: `${enemyData.name} ${String.fromCharCode(65 - 1 + enemyNamesAndCounts[enemyData.name])}`,
        icon: enemyData.icon,
        abilities: ['BasicAttack', ...enemyData.abilities],
        stats,
        statusEffects: [],
        idleChance: enemyData.idleChance,
        cooldowns: {},
        currentSpeed: 0,
        currentEnergy: enemyData.energy,
        maxEnergy: enemyData.energy,
        currentHealth: enemyData.health,
        maxHealth: enemyData.health,
        drops
      };
    });

    // speed adjustments
    const maxSpeed = 1 + Math.max(
      currentPlayer.stats[Stat.Speed],
      ...threatData.enemies.map(enemyName => this.contentService.getEnemyByName(enemyName).stats[Stat.Speed] ?? 1)
    );

    [currentPlayer, ...enemies].forEach(char => {
      char.stats[Stat.Speed] = maxSpeed - char.stats[Stat.Speed];
      char.currentSpeed = random(Math.floor(char.stats[Stat.Speed] / 2), char.stats[Stat.Speed]);
    });

    // every 10th level requires a dungeon dive
    let shouldGiveSkillPoint = threatData.maxSkillGainLevel > state.level;
    if((state.level % 10) === 0) {
      shouldGiveSkillPoint = false;
    }

    if(state.level === 0) {
      shouldGiveSkillPoint = true;
    }

    ctx.dispatch(new IncrementStat(AchievementStat.CombatThreatsEngaged));

    ctx.setState(patch<IGameCombat>({
      currentPlayer,
      currentEncounter: {
        enemies,
        log: [`Combat against ${threatData.name} start!`],
        shouldResetPlayer,
        isLocked: false,
        isLockedForEnemies: false,
        shouldExitDungeon,
        resetInSeconds: -1,

        shouldGiveSkillPoint
      }
    }));
  }

  @Action(EnemyTakeTurn)
  enemyTakeTurn(ctx: StateContext<IGameCombat>, { enemyIndex }: EnemyTakeTurn) {

    const { currentPlayer, currentEncounter } = ctx.getState();

    if(!currentPlayer || !currentEncounter) {
      return;
    }

    const enemy = currentEncounter.enemies[enemyIndex];

    // dead enemies don't get to play the game
    if(enemy.currentHealth <= 0) {
      return;
    }

    const preTurnDeltas: ICombatDelta[] = [];
    const healingPerRound = enemy.stats[Stat.HealingPerRound];
    const energyPerRound = enemy.stats[Stat.EnergyPerRound];

    if(healingPerRound > 0) {
      ctx.dispatch(new AddCombatLogMessage(`${enemy.name} healed ${healingPerRound} HP!`));
      preTurnDeltas.push({ target: 'source', attribute: 'currentHealth', delta: healingPerRound });
      this.emitDamageNumber(currentPlayer, ctx.getState(), healingPerRound);
    }

    if(energyPerRound > 0) {
      ctx.dispatch(new AddCombatLogMessage(`${enemy.name} restored ${energyPerRound} energy!`));
      preTurnDeltas.push({ target: 'source', attribute: 'currentEnergy', delta: energyPerRound });
    }

    if(preTurnDeltas.length > 0) {
      applyDeltas(ctx, enemy, enemy, preTurnDeltas);
    }

    ctx.dispatch([
      new LowerEnemyCooldown(enemyIndex)
    ]);

    // if not idle, pick a skill and a valid target
    const validSkills = this.enemyChooseValidAbilities(enemy, currentEncounter.enemies);

    // sometimes enemies can just idle - either they have nothing to do, or they just want to taunt
    const isIdle = random(0, 100) <= enemy.idleChance;

    if(isIdle || validSkills.length === 0) {
      ctx.dispatch([
        new AddCombatLogMessage(`${enemy.name} is faffing about.`),
        new TickEnemyEffects(enemyIndex),
        new EnemySpeedReset(enemyIndex)
      ]);
      return;
    }

    // use the skill
    const chosenSkill = sample(validSkills) as string;
    const chosenSkillRef = this.contentService.getAbilityByName(chosenSkill);

    chosenSkillRef.effects.forEach(effectRef => {
      const abilityFunc = getCombatFunction(effectRef.effect);
      if(!abilityFunc) {
        ctx.dispatch([
          new AddCombatLogMessage(`Ability ${effectRef.effect} (c/o ${enemy.name}) is not implemented yet!`),
          new TickEnemyEffects(enemyIndex),
          new EnemySpeedReset(enemyIndex)
        ]);
        return;
      }

      const targets = this.enemyAbilityChooseTargets(ctx, currentPlayer, enemy, currentEncounter.enemies, chosenSkillRef, effectRef);
      targets.forEach(target => {
        const deltas = abilityFunc(ctx, {
          ability: chosenSkillRef,
          source: enemy,
          target,
          useStats: enemy.stats,
          allowBonusStats: true,
          statusEffect: this.contentService.getEffectByName(effectRef.effectName || '')
        });
        deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -chosenSkillRef.energyCost });

        const hp = target.currentHealth;
        applyDeltas(ctx, enemy, target, deltas);
        const newHp = target.currentHealth;

        if(hp !== newHp) {
          this.emitDamageNumber(target, ctx.getState(), newHp - hp);

          if(target === currentPlayer) {
            ctx.dispatch(new PlaySFX('combat-hit-player'));
          } else {
            ctx.dispatch(new PlaySFX('combat-hit-enemy'));
          }
        }
      });
    });

    // cool down the skill
    ctx.dispatch(new EnemyCooldownSkill(enemyIndex, enemy.abilities.indexOf(chosenSkill), chosenSkillRef.cooldown));

    // check for victory
    if(hasAnyoneWonCombat(ctx)) {
      handleCombatEnd(ctx);
      return;
    }

    ctx.dispatch([
      new EnemySpeedReset(enemyIndex),
      new TickEnemyEffects(enemyIndex)
    ]);
  }

  @Action(TargetEnemyWithAbility)
  targetEnemyWithAbility(
    ctx: StateContext<IGameCombat>,
    { targetIndex, source, ability, abilitySlot, fromItem }: TargetEnemyWithAbility
  ) {
    ability.effects.forEach((effectRef) => {
      const abilityFunc = getCombatFunction(effectRef.effect);
      if(!abilityFunc) {
        ctx.dispatch(new AddCombatLogMessage(`Ability ${effectRef.effect} is not implemented yet!`));
        return;
      }

      const encounter = ctx.getState().currentEncounter;
      if(!encounter) {
        return;
      }

      const player = ctx.getState().currentPlayer;
      if(!player) {
        return;
      }

      const target = encounter.enemies[targetIndex];
      if(isDead(target)) {
        return;
      }

      const useStats = fromItem ? merge(defaultStatsZero(), fromItem.stats) : player.stats;
      const deltas = abilityFunc(ctx, {
        ability,
        source,
        target,
        useStats,
        allowBonusStats: !fromItem,
        statusEffect: this.contentService.getEffectByName(effectRef.effectName || '')
      });
      deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -ability.energyCost });

      const hp = target.currentHealth;
      applyDeltas(ctx, source, target, deltas);
      const newHp = target.currentHealth;

      if(hp !== newHp) {
        this.emitDamageNumber(target, ctx.getState(), newHp - hp);

        if(newHp - hp < 0) {
          ctx.dispatch([
            new IncrementStat(AchievementStat.Damage, Math.abs(newHp - hp)),
            new PlaySFX('combat-hit-enemy')
          ]);
        } else {
          ctx.dispatch([
            new IncrementStat(AchievementStat.Healing, Math.abs(newHp - hp)),
            new PlaySFX('combat-effect')
          ]);
        }
      }

      if(isDead(target)) {
        ctx.dispatch([
          new AddCombatLogMessage(`${target.name} has been slain!`),
          new IncrementStat(AchievementStat.Kills)
        ]);
        acquireItemDrops(ctx, target.drops);
      }
    });

    ctx.dispatch(new PlayerCooldownSkill(abilitySlot, ability.cooldown));

    if(hasAnyoneWonCombat(ctx)) {
      handleCombatEnd(ctx);
      return;
    }

    ctx.dispatch([
      new PlayerSpeedReset(),
      new TickPlayerEffects(),
      new SetCombatLock(true)
    ]);
  }

  @Action(TargetSelfWithAbility)
  targetSelfWithAbility(ctx: StateContext<IGameCombat>, { ability, abilitySlot, fromItem }: TargetSelfWithAbility) {

    const currentPlayer = ctx.getState().currentPlayer;
    if(!currentPlayer) {
      return;
    }

    ability.effects.forEach(effectRef => {
      const abilityFunc = getCombatFunction(effectRef.effect);
      if(!abilityFunc) {
        ctx.dispatch(new AddCombatLogMessage(`Ability ${effectRef.effect} is not implemented yet!`));
        return;
      }

      const useStats = fromItem ? merge(defaultStatsZero(), fromItem.stats) : currentPlayer.stats;
      const deltas = abilityFunc(ctx, {
        ability,
        source: currentPlayer,
        target: currentPlayer,
        useStats,
        allowBonusStats: !fromItem,
        statusEffect: this.contentService.getEffectByName(effectRef.effectName || '')
      });
      deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -ability.energyCost });

      const hp = currentPlayer.currentHealth;
      applyDeltas(ctx, currentPlayer, currentPlayer, deltas);
      const newHp = currentPlayer.currentHealth;

      if(hp !== newHp) {
        this.emitDamageNumber(currentPlayer, ctx.getState(), newHp - hp);

        if(newHp - hp < 0) {
          ctx.dispatch([
            new IncrementStat(AchievementStat.Damage, Math.abs(newHp - hp)),
            new PlaySFX('combat-hit-player')
          ]);
        } else {
          ctx.dispatch([
            new IncrementStat(AchievementStat.Healing, Math.abs(newHp - hp)),
            new PlaySFX('combat-effect')
          ]);
        }
      }
    });

    ctx.dispatch(new PlayerCooldownSkill(abilitySlot, ability.cooldown));

    if(hasAnyoneWonCombat(ctx)) {
      handleCombatEnd(ctx);
      return;
    }

    ctx.dispatch([
      new PlayerSpeedReset(),
      new TickPlayerEffects(),
      new SetCombatLock(true)
    ]);
  }

  @Action(ChangeThreats)
  changeThreats(ctx: StateContext<IGameCombat>) {
    const playerLevel = ctx.getState().level;
    const validThreats = Object.keys(this.contentService.getAllThreats())
      .map(x => ({ id: x, threat: this.contentService.getThreatByName(x) }))
      .filter(
        (x) => x.threat.level.min <= playerLevel && x.threat.level.max >= playerLevel
      );

    const newThreats = [sample(validThreats), sample(validThreats), sample(validThreats)].filter(Boolean).map(x => x?.id);

    ctx.setState(patch<IGameCombat>({
      threatChangeTicks: 3600,
      threats: newThreats as string[]
    }));
  }

  @Action(EnterDungeon)
  enterDungeon(ctx: StateContext<IGameCombat>, { dungeon }: EnterDungeon) {
    const store = this.store.snapshot();

    // we need the active player to exist. it always will. probably?
    const activePlayer = store.charselect.characters[store.charselect.currentCharacter];
    if(!activePlayer) {
      return;
    }

    const dungeonCharacter = getPlayerCharacterReadyForCombat(store, ctx, activePlayer);

    const startPos = findUniqueTileInDungeonFloor(dungeon, 0, DungeonTile.Entrance);
    if(!startPos) {
      return;
    }

    ctx.dispatch(new IncrementStat(AchievementStat.CombatDungeonsEntered));

    ctx.setState(patch<IGameCombat>({
      currentPlayer: dungeonCharacter,
      currentDungeon: {
        currentLoot: {
          items: [],
          resources: {}
        },
        pos: {
          x: startPos.x,
          y: startPos.y,
          z: 0
        },
        dungeon
      }
    }));
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameCombat>, { ticks }: TickTimer) {
    const state = ctx.getState();

    // modify threats if applicable
    // (while you're in a dungeon or encounter, your threats reset immediately afterwards anyway)
    if(!state.currentDungeon && !state.currentEncounter) {
      if(state.threatChangeTicks <= 0) {
        ctx.dispatch(new ChangeThreats());
      }

      ctx.setState(patch<IGameCombat>({
        threatChangeTicks: state.threatChangeTicks - ticks
      }));
    }

    if(state.currentEncounter && state.currentPlayer) {

      // check for combat ending and get out soon
      if(state.currentEncounter.resetInSeconds === 0) {
        dispatchCorrectCombatEndEvent(ctx, state.currentEncounter);
        return;
      }

      if(state.currentEncounter.resetInSeconds > 0) {
        ctx.setState(patch<IGameCombat>({
          currentEncounter: patch<IGameEncounter>({

            // unaffected by #ticks, intentionall
            resetInSeconds: Math.max(0, state.currentEncounter.resetInSeconds - 1)
          })
        }));

        return;
      }

      let canSomeoneAct = false;
      let numAttempts = Math.max(0, ...[state.currentPlayer.currentSpeed, ...state.currentEncounter.enemies.map(x => x.currentSpeed)]);

      while(!canSomeoneAct) {
        if(numAttempts <= 0) {
          break;
        }

        const checkState = ctx.getState();
        if(!checkState.currentEncounter || !checkState.currentPlayer) {
          break;
        }

        const player = checkState.currentPlayer;

        // if its the players turn, bail
        if(player.currentSpeed <= 0) {
          canSomeoneAct = true;
          break;
        }

        // enemies get first dibs
        checkState.currentEncounter.enemies.forEach((enemy, index) => {
          if(checkState.currentEncounter?.isLockedForEnemies) {
            return;
          }

          if(enemy.currentHealth <= 0) {
            return;
          }

          const newEnemySpeed = enemy.currentSpeed - 1;

          ctx.setState(patch<IGameCombat>({
            currentEncounter: patch<IGameEncounter>({
              enemies: updateItem<IGameEncounterCharacter>(index, patch<IGameEncounterCharacter>({
                currentSpeed: newEnemySpeed
              }))
            })
          }));

          if(newEnemySpeed <= 0) {
            canSomeoneAct = true;
            ctx.dispatch(new EnemyTakeTurn(index));
            return;
          }

        });

        // then the player gets a chance to go
        const newSpeed = player.currentSpeed - 1;
        ctx.setState(patch<IGameCombat>({
          currentPlayer: patch<IGameEncounterCharacter>({
            currentSpeed: newSpeed
          })
        }));

        // unlock combat when the player can do something
        if(newSpeed <= 0) {
          const preTurnDeltas: ICombatDelta[] = [];
          const healingPerRound = player.stats[Stat.HealingPerRound];
          const energyPerRound = player.stats[Stat.EnergyPerRound];

          if(healingPerRound > 0) {
            ctx.dispatch(new AddCombatLogMessage(`${player.name} healed ${healingPerRound} HP!`));
            preTurnDeltas.push({ target: 'source', attribute: 'currentHealth', delta: healingPerRound });
            this.emitDamageNumber(player, ctx.getState(), healingPerRound);
          }

          if(energyPerRound > 0) {
            ctx.dispatch(new AddCombatLogMessage(`${player.name} restored ${energyPerRound} energy!`));
            preTurnDeltas.push({ target: 'source', attribute: 'currentEnergy', delta: energyPerRound });
          }

          if(preTurnDeltas.length > 0) {
            applyDeltas(ctx, player, player, preTurnDeltas);
          }

          canSomeoneAct = true;
          ctx.dispatch(new SetCombatLock(false));
          break;
        }

        numAttempts--;
      }
    }
  }

  private enemyChooseValidAbilities(enemy: IGameEncounterCharacter, allies: IGameEncounterCharacter[]): string[] {
    return enemy.abilities.filter((abi, index) => {
      if(enemy.cooldowns[index] > 0) {
        return false;
      }

      const skill = this.contentService.getAbilityByName(abi);
      if(!skill) {
        return false;
      }

      if(enemy.currentEnergy < skill.energyCost) {
        return false;
      }

      if(skill.effects.some(eff => isHealEffect(eff))) {
        return allies.filter(x => x.currentHealth > 0 && x.currentHealth < x.maxHealth).length > 0;
      }

      return true;
    });
  }

  private enemyAbilityChooseTargets(
    ctx: StateContext<IGameCombat>,
    player: IGameEncounterCharacter,
    self: IGameEncounterCharacter,
    allies: IGameEncounterCharacter[],
    skill: IGameCombatAbility,
    effect: IGameCombatAbilityEffect
  ): IGameEncounterCharacter[] {

    switch(skill.target) {
      case CombatAbilityTarget.Ally: {
        if(isHealEffect(effect)) {
          const validAllies = allies.filter(x => x.currentHealth > 0 && x.currentHealth < x.maxHealth);
          if(validAllies.length > 0) {
            return [sample(validAllies) as IGameEncounterCharacter];
          }
        }

        return [sample(allies) as IGameEncounterCharacter];
      }

      case CombatAbilityTarget.Self: {
        return [self];
      }

      case CombatAbilityTarget.Single: {
        return [player];
      }

      case CombatAbilityTarget.AllEnemies: {
        return [player];
      }

      case CombatAbilityTarget.All: {
        return [player, ...allies];
      }

      default: {
        return [self];
      }
    }
  }

}
