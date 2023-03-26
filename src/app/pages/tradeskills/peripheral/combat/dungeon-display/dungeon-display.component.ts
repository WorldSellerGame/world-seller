import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { clamp, cloneDeep } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { DungeonNode, DungeonTile, IDungeon, IGameDungeonState, IGameEncounterCharacter } from '../../../../../../interfaces';
import { CombatState } from '../../../../../../stores';
import {
  FullyHeal, GainPercentageOfDungeonLoot,
  LeaveDungeon, MoveInDungeonByDelta
} from '../../../../../../stores/combat/dungeon.actions';
import { ContentService } from '../../../../../services/content.service';

@Component({
  selector: 'app-dungeon-display',
  templateUrl: './dungeon-display.component.html',
  styleUrls: ['./dungeon-display.component.scss'],
})
export class DungeonDisplayComponent implements OnInit, OnDestroy {

  public readonly debugActions = [
    { icon: 'basket',   text: 'Gain 100% Loot',    action: GainPercentageOfDungeonLoot, actionArgs: [100] },
    { icon: 'basket',   text: 'Gain 50% Loot',     action: GainPercentageOfDungeonLoot, actionArgs: [50] },
    { icon: 'bonfire',  text: 'Heal Player',       action: FullyHeal },
    { icon: 'trash',    text: 'Leave Dungeon',     action: LeaveDungeon },
  ];

  @Select(CombatState.currentPlayer) currentPlayer$!: Observable<IGameEncounterCharacter>;
  @Select(CombatState.currentDungeon) currentDungeon$!: Observable<IGameDungeonState>;

  private dungeonSub!: Subscription;
  public dungeonDisplay: DungeonNode[][] = [];

  constructor(private store: Store, private contentService: ContentService) { }

  private arrowKeys = (event: KeyboardEvent) => {
    switch(event.key) {
      case 'ArrowUp':     this.store.dispatch(new MoveInDungeonByDelta(0,  -1)); break;
      case 'ArrowDown':   this.store.dispatch(new MoveInDungeonByDelta(0,   1)); break;
      case 'ArrowLeft':   this.store.dispatch(new MoveInDungeonByDelta(-1,  0)); break;
      case 'ArrowRight':  this.store.dispatch(new MoveInDungeonByDelta(1,   0)); break;
    }
  };

  ngOnInit() {
    document.addEventListener('keydown', this.arrowKeys);

    this.dungeonSub = this.currentDungeon$.subscribe(dungeon => {
      if(!dungeon) {
        this.dungeonDisplay = [];
        return;
      }

      this.dungeonDisplay = this.dungeonView(dungeon.pos, dungeon.dungeon);
    });
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.arrowKeys);

    this.dungeonSub?.unsubscribe();
  }

  trackBy(index: number) {
    return index;
  }

  getIconForTile(dungeon: IDungeon, tile: DungeonNode) {
    if(dungeon.threats[tile]) {
      const threat = this.contentService.getThreatByName(dungeon.threats[tile]);
      return threat?.icon ?? 'dungeon-wall';
    }

    if(dungeon.treasureChests[tile]) {
      return 'dungeon-chest';
    }

    switch(tile) {
      case DungeonTile.Floor:     return 'dungeon-tile';
      case DungeonTile.Wall:      return 'dungeon-wall';
      case DungeonTile.Fire:      return 'dungeon-heal';
      case DungeonTile.Entrance:  return 'dungeon-stairs';
      case DungeonTile.Exit:      return 'dungeon-stairs';
      case DungeonTile.Boss: {
        const threat = this.contentService.getThreatByName(dungeon.boss);
        return threat?.icon ?? 'dungeon-wall';
      }

      default:                    return 'dungeon-wall';
    }
  }

  getColorForTile(dungeon: IDungeon, tile: DungeonNode) {
    if(dungeon.threats[tile]) {
      return '#f00';
    }

    if(dungeon.treasureChests[tile]) {
      return '#0aa';
    }

    switch(tile) {
      case DungeonTile.Floor:     return '#fff';
      case DungeonTile.Wall:      return '#fff';
      case DungeonTile.Fire:      return '#a0a';
      case DungeonTile.Entrance:  return '#0f0';
      case DungeonTile.Exit:      return '#0f0';
      case DungeonTile.Boss:      return '#f0f';
      default:                    return '#fff';
    }
  }

  canMoveTo(dungeon: IDungeon, curFloor: number, x: number, y: number): boolean {
    const tile = dungeon.floors[curFloor].layout[y][x];
    return tile !== DungeonTile.Wall;
  }

  movePlayer(x: number, y: number) {
    this.store.dispatch(new MoveInDungeonByDelta(x, y));
  }

  dungeonView(curPos: { x: number; y: number; z: number }, dungeon: IDungeon): DungeonNode[][] {
    const dungeonClone = cloneDeep(dungeon);

    dungeonClone.floors[curPos.z].layout[curPos.y][curPos.x] = 'me';

    const offsetTop = clamp(curPos.y - 4, 0, dungeonClone.floors[curPos.z].layout.length);
    const offsetLeft = clamp(curPos.x - 4, 0, dungeonClone.floors[curPos.z].layout[curPos.y].length);

    const startOffsetTop = Math.min(offsetTop, dungeonClone.floors[curPos.z].layout.length - 9);
    const view = dungeonClone.floors[curPos.z].layout.slice(startOffsetTop, startOffsetTop + 9);
    for(let i = 0; i < view.length; i++) {
      const startOffsetLeft = Math.min(offsetLeft, view[i].length - 9);
      view[i] = view[i].slice(startOffsetLeft, startOffsetLeft + 9);
    }

    return view;
  }

}
