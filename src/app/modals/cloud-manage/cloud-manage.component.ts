import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CloudSaveService } from '../../services/cloudsave.service';

@Component({
  selector: 'app-cloud-manage',
  templateUrl: './cloud-manage.component.html',
  styleUrls: ['./cloud-manage.component.scss'],
})
export class CloudManageComponent implements OnInit {

  constructor(
    private store: Store,
    public modal: ModalController,
    public cloudSaveService: CloudSaveService
  ) { }

  ngOnInit() {}

}
