import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Howl } from 'howler';
import { Subject } from 'rxjs';
import { GameOption } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class VisualsService {

  private damageSub = new Subject<{ slot: string; value: number }>();

  public get damage$() {
    return this.damageSub.asObservable();
  }

  constructor(private store: Store) {}

  emitDamageNumber(slot: string, value: number) {
    this.damageSub.next({ slot, value });
  }

  playSoundEffect(sound: string) {
    const options = this.store.snapshot().options;

    const masterPercent = (options[GameOption.SoundMaster] || 100) / 100;
    const sfxPercent = (options[GameOption.SoundSFX] || 100) / 100;

    const soundByte = new Howl({
      src: [`assets/sfx/${sound}.wav`],
      volume: masterPercent * sfxPercent
    });

    soundByte.play();
  }
}
