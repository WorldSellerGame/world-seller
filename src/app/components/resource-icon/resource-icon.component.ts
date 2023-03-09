import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-resource-icon',
  templateUrl: './resource-icon.component.html',
  styleUrls: ['./resource-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceIconComponent implements OnInit {

  @Input() name = '';
  @Input() quantity = -1;
  @Input() maxQuantity = 0;
  @Input() showX = false;
  @Input() angryColorWhenQuantityExceedsMax = false;
  @Input() inlineIconSize = false;
  @Input() emphasizeText = true;

  public get resource() {
    return this.contentService.getResourceByName(this.name);
  }

  public get icon() {
    return this.resource?.icon.toLowerCase();
  }

  public get rarity() {
    return this.resource?.rarity.toLowerCase();
  }

  public get description() {
    return this.resource?.description;
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
