import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisualsService {

  private damageSub = new Subject<{ slot: string; value: number }>();

  public get damage$() {
    return this.damageSub.asObservable();
  }

  constructor() { }

  emitDamageNumber(slot: string, value: number) {
    this.damageSub.next({ slot, value });
  }
}
