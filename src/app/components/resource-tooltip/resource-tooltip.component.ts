import { Component, Input, OnInit } from '@angular/core';
import { IGameResource } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-resource-tooltip',
  templateUrl: './resource-tooltip.component.html',
  styleUrls: ['./resource-tooltip.component.scss'],
})
export class ResourceTooltipComponent implements OnInit {

  @Input() resource!: IGameResource;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

}
