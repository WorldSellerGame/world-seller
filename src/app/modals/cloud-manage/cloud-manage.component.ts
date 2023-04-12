import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { UnlinkCharacterCloud } from '../../../stores/charselect/charselect.actions';
import { UpdateFirebaseUID } from '../../../stores/game/game.actions';
import { CloudSaveService } from '../../services/cloudsave.service';
import { MetaService } from '../../services/meta.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-cloud-manage',
  templateUrl: './cloud-manage.component.html',
  styleUrls: ['./cloud-manage.component.scss'],
})
export class CloudManageComponent implements OnInit {

  public savefiles!: Observable<any[]>;
  public currentCharacterId!: string;

  constructor(
    private store: Store,
    public modal: ModalController,
    private metaService: MetaService,
    private notifyService: NotifyService,
    public cloudSaveService: CloudSaveService
  ) { }

  async ngOnInit() {
    this.currentCharacterId = this.metaService.characterSavefile().charId;
    this.savefiles = await this.cloudSaveService.allSavefiles();

    this.cloudSaveService.loadCurrentSavefile();
  }

  logout() {
    this.store.dispatch(new UpdateFirebaseUID(''));
    this.cloudSaveService.logout();
    this.modal.dismiss();
  }

  deleteCharacterFromCloud(charId: string) {
    this.notifyService.confirm(
      'Delete Character From Cloud',
      'Are you sure you want to delete this character from the cloud? You will not be able to recover it unless you have a backup.',
      [
        { text: 'No, Cancel', role: 'cancel' },
        { text: 'Yes, Delete', handler: () => {
          this.store.dispatch(new UnlinkCharacterCloud(charId));
          this.cloudSaveService.deleteCloudSavefile(charId);
        } }
      ]);
  }

  syncCharacter(charId: string) {
    this.notifyService.confirm(
      'Use Character From Cloud',
      'Are you sure you want to use this character from the cloud? Your current character will be overwritten and not recoverable.',
      [
        { text: 'No, Cancel', role: 'cancel' },
        { text: 'Yes, Overwrite', handler: () => {
          this.cloudSaveService.loadSavefile(charId);
          this.modal.dismiss();
        } }
      ]);
  }

}
