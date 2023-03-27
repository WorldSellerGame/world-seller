import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameResource } from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-resource-tooltip',
  templateUrl: './resource-tooltip.component.html',
  styleUrls: ['./resource-tooltip.component.scss'],
})
export class ResourceTooltipComponent implements OnInit {

  @Input() resource!: IGameResource;
  @Input() showQuantity!: boolean;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

}
