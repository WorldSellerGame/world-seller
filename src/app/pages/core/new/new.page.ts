import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { ICharacter } from '../../../../interfaces';
import { CharSelectState } from '../../../../stores';
import { CreateCharacter } from '../../../../stores/charselect/charselect.actions';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  @Select(CharSelectState.characters) characters$!: Observable<ICharacter[]>;

  public character = { name: '' };

  constructor(private router: Router, private store: Store) { }

  cleanName() {
    return this.character.name.trim();
  }

  canCreate() {
    return this.cleanName();
  }

  ngOnInit() {
  }

  create() {
    if(!this.canCreate()) {
      return;
    }

    this.store.dispatch(new CreateCharacter(this.character.name)).subscribe(() => {
      this.characters$.pipe(first()).subscribe(characters => {
        this.router.navigate([`/game/${characters.length - 1}`]);
      });
    });
  }

}
