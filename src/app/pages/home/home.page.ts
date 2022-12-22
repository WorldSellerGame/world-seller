import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ICharacter } from '../../../interfaces';
import { CharSelectState } from '../../../stores';
import { DeleteCharacter } from '../../../stores/charselect/charselect.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @Select(CharSelectState.characters) characters$!: Observable<ICharacter[]>;

  constructor(
    private store: Store,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  canMakeNewCharacter(characterList: ICharacter[]) {
    return characterList.length < 1;
  }

  async playCharacter(slot: number) {
    await this.router.navigate([`/game/${slot}/dashboard`]);
  }

  async deleteCharacter(slot: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Character',
      message: 'Are you sure you want to delete this character?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(new DeleteCharacter(slot));
          }
        }
      ]
    });

    await alert.present();
  }

}
