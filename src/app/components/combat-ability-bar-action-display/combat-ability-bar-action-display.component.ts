import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IGameCombatAbility } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-combat-ability-bar-action-display',
  templateUrl: './combat-ability-bar-action-display.component.html',
  styleUrls: ['./combat-ability-bar-action-display.component.scss'],
})
export class CombatAbilityBarActionDisplayComponent implements OnInit, OnChanges {

  @Input() action!: string;
  @Input() active = false;

  public actionRef!: IGameCombatAbility;

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if(changes.action) {
      this.lookupAction();
    }
  }

  private lookupAction() {
    this.actionRef = this.contentService.getAbilityByName(this.action);
  }

}
