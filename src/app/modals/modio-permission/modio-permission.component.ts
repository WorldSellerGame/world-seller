import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { SetModioAuthToken } from '../../../stores/mods/mods.actions';
import { ModsService } from '../../services/mods.service';

@Component({
  selector: 'app-modio-permission',
  templateUrl: './modio-permission.component.html',
  styleUrls: ['./modio-permission.component.scss'],
})
export class ModioPermissionComponent implements OnInit {

  public email = '';
  public code = '';
  public isDoing = false;

  public successStatus: { message: string } | undefined;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public errorStatus: { error_ref: number; errors: Record<string, string>; message: string } | undefined;

  constructor(
    private store: Store,
    public modal: ModalController,
    private modsService: ModsService
  ) { }

  ngOnInit() {}

  requestCode() {
    if(!this.email || !this.email.includes('@')) {
      return;
    }

    this.successStatus = undefined;
    this.errorStatus = undefined;

    this.isDoing = true;
    this.modsService.requestCodeForEmail(this.email).subscribe({
      next: (result: any) => {
        this.isDoing = false;

        this.successStatus = result;
      },
      error: (err) => {
        this.isDoing = false;

        const error = err.error.error;
        this.errorStatus = error;
      }
    });
  }

  submitCode() {
    if(!this.code || this.code.length !== 5) {
      return;
    }

    this.isDoing = true;
    this.modsService.getAuthCodeForEmail(this.code).subscribe({
      next: async (result: any) => {
        this.isDoing = false;

        const accessToken = result.access_token;
        const expiresAt = result.date_expires * 1000;

        this.store.dispatch(new SetModioAuthToken(accessToken, expiresAt));
        await this.modal.dismiss();

        this.modsService.openModManager();
      },
      error: (err) => {
        this.isDoing = false;

        const error = err.error.error;
        this.errorStatus = error;
      }
    });
  }

}
