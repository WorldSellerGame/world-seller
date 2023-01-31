

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { merge, random, sample } from 'lodash';
import {
  applyDeltas,
  calculateMaxEnergy, calculateMaxHealth, defaultStatsZero,
  getCombatFunction,
  getSkillsFromItems, getStatTotals, getTotalLevel, handleCombatEnd, hasAnyoneWonCombat, isHealEffect
} from '../../app/helpers';
import { ContentService } from '../../app/services/content.service';
import {
  CombatAbilityTarget, IGameCombat, IGameCombatAbility,
  IGameCombatAbilityEffect,
  IGameEncounter, IGameEncounterCharacter, IGameEncounterDrop, Stat
} from '../../interfaces';
import { TickTimer } from '../game/game.actions';
import {
  AddCombatLogMessage, ChangeThreats, EnemyCooldownSkill,
  EnemySpeedReset, EnemyTakeTurn, InitiateCombat, LowerEnemyCooldown, SetCombatLock
} from './combat.actions';
import { attachments } from './combat.attachments';
import {
  defaultCombat
} from './combat.functions';

@State<IGameCombat>({
  name: 'combat',
  defaults: defaultCombat()
})
@Injectable()
export class CombatState {

  constructor(private store: Store, private contentService: ContentService) {
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

  @Action(InitiateCombat)
  initiateCombat(ctx: StateContext<IGameCombat>, { threat, shouldResetPlayer }: InitiateCombat) {
    const store = this.store.snapshot();
    const state = ctx.getState();

    // use either the current player, or create a new one for combat
    let currentPlayer = ctx.getState().currentPlayer;
    if(!currentPlayer) {

      const activePlayer = store.charselect.characters[store.charselect.currentCharacter];
      if(!activePlayer) {
        return;
      }

      const stats = merge(defaultStatsZero(), getStatTotals(activePlayer));

      currentPlayer = {
        name: activePlayer.name,
        icon: '',
        abilities: [
          'BasicAttack', 'BasicUtilityEscape',
          ...getSkillsFromItems(activePlayer.equipment),
          ...state.activeSkills.filter(Boolean)
        ],
        level: getTotalLevel(store),
        stats,
        cooldowns: {},
        idleChance: 0,
        drops: [],
        currentSpeed: 0,
        currentEnergy: calculateMaxEnergy(activePlayer),
        maxEnergy: calculateMaxEnergy(activePlayer),
        currentHealth: calculateMaxHealth(activePlayer),
        maxHealth: calculateMaxHealth(activePlayer)
      } as IGameEncounterCharacter;
    }

    // set up enemies for combat
    const enemyNamesAndCounts: Record<string, number> = {};

    const enemies: IGameEncounterCharacter[] = threat.enemies.map(enemyName => {
      const enemyData = this.contentService.enemies[enemyName];

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
        level: threat.level,
        stats,
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
      ...threat.enemies.map(enemyName => this.contentService.enemies[enemyName].stats[Stat.Speed] ?? 1)
    );

    [currentPlayer, ...enemies].forEach(char => {
      char.stats[Stat.Speed] = maxSpeed - char.stats[Stat.Speed];
      char.currentSpeed = random(1, char.stats[Stat.Speed]);
    });

    ctx.setState(patch<IGameCombat>({
      currentPlayer,
      currentEncounter: {
        enemies,
        log: [`Combat against ${threat.name} start!`],
        shouldResetPlayer,
        isLocked: false,
        isLockedForEnemies: false,
        shouldGiveSkillPoint: threat.maxSkillGainLevel > state.level
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

    ctx.dispatch(new LowerEnemyCooldown(enemyIndex));

    // if not idle, pick a skill and a valid target
    const validSkills = this.enemyChooseValidAbilities(enemy, currentEncounter.enemies);

    // sometimes enemies can just idle - either they have nothing to do, or they just want to taunt
    const isIdle = random(0, 100) <= enemy.idleChance;

    if(isIdle || validSkills.length === 0) {
      ctx.dispatch([
        new AddCombatLogMessage(`${enemy.name} is faffing about.`),
        new EnemySpeedReset(enemyIndex)
      ]);
      return;
    }

    // use the skill
    const chosenSkill = sample(validSkills) as string;
    const chosenSkillRef = this.contentService.abilities[chosenSkill];

    chosenSkillRef.effects.forEach(effectRef => {
      const abilityFunc = getCombatFunction(effectRef.effect);
      if(!abilityFunc) {
        ctx.dispatch([
          new AddCombatLogMessage(`Ability ${effectRef.effect} (c/o ${enemy.name}) is not implemented yet!`),
          new EnemySpeedReset(enemyIndex)
        ]);
        return;
      }

      const target = this.enemyAbilityChooseTargets(ctx, currentPlayer, enemy, currentEncounter.enemies, chosenSkillRef, effectRef);

      const deltas = abilityFunc(ctx, { ability: chosenSkillRef, source: enemy, target, useStats: enemy.stats, allowBonusStats: true });
      deltas.push({ target: 'source', attribute: 'currentEnergy', delta: -chosenSkillRef.energyCost });
      applyDeltas(ctx, enemy, target, deltas);
    });

    // cool down the skill
    ctx.dispatch(new EnemyCooldownSkill(enemyIndex, enemy.abilities.indexOf(chosenSkill), chosenSkillRef.cooldown));

    // check for victory
    if(hasAnyoneWonCombat(ctx)) {
      handleCombatEnd(ctx);
      return;
    }

    ctx.dispatch(new EnemySpeedReset(enemyIndex));
  }

  @Action(ChangeThreats)
  changeThreats(ctx: StateContext<IGameCombat>) {
    const store = this.store.snapshot();

    const playerLevel = getTotalLevel(store);
    const validThreats = Object.keys(this.contentService.threats)
      .map(x => ({ id: x, threat: this.contentService.threats[x] }))
      .filter(
        (x) => x.threat.level.min <= playerLevel && x.threat.level.max >= playerLevel
      );

    const newThreats = [sample(validThreats), sample(validThreats), sample(validThreats)].filter(Boolean).map(x => x?.id);

    ctx.setState(patch<IGameCombat>({
      threatChangeTicks: 3600,
      threats: newThreats as string[]
    }));
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameCombat>, { ticks }: TickTimer) {
    const state = ctx.getState();

    // modify threats if applicable
    if(state.threatChangeTicks <= 0) {
      ctx.dispatch(new ChangeThreats());
    }

    ctx.setState(patch<IGameCombat>({
      threatChangeTicks: state.threatChangeTicks - ticks
    }));

    if(state.currentEncounter && state.currentPlayer) {
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

        const newSpeed = player.currentSpeed - 1;
        ctx.setState(patch<IGameCombat>({
          currentPlayer: patch<IGameEncounterCharacter>({
            currentSpeed: newSpeed
          })
        }));

        // unlock combat when the player can do something
        if(newSpeed <= 0) {
          canSomeoneAct = true;
          ctx.dispatch(new SetCombatLock(false));
          break;
        }

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

        numAttempts--;
      }
    }
  }

  private enemyChooseValidAbilities(enemy: IGameEncounterCharacter, allies: IGameEncounterCharacter[]): string[] {
    return enemy.abilities.filter((abi, index) => {
      if(enemy.cooldowns[index] > 0) {
        return false;
      }

      const skill = this.contentService.abilities[abi];
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
  ): IGameEncounterCharacter {

    switch(skill.target) {
      case CombatAbilityTarget.Ally: {
        if(isHealEffect(effect)) {
          const validAllies = allies.filter(x => x.currentHealth > 0 && x.currentHealth < x.maxHealth);
          if(validAllies.length > 0) {
            return sample(validAllies) as IGameEncounterCharacter;
          }
        }

        return sample(allies) as IGameEncounterCharacter;
      }

      case CombatAbilityTarget.Self: {
        return self;
      }

      case CombatAbilityTarget.Single: {
        return player;
      }

      case CombatAbilityTarget.AllEnemies: {
        return player;
      }

      default: {
        return self;
      }
    }
  }

}
