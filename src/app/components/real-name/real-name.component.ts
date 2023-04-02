import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-real-name',
  templateUrl: './real-name.component.html',
  styleUrls: ['./real-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealNameComponent implements OnInit {

  @Input() set name(value: string) {
    const isItem = this.contentService.isItem(value);

    if(isItem) {
      const item = this.contentService.getItemByName(value);
      this.realName = item?.name ?? '???';
    } else {
      const resource = this.contentService.getResourceByName(value);
      this.realName = resource?.name ?? '???';
    }
  }

  public realName = '';

  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

}
