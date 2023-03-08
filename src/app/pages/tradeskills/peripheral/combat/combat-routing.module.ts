import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CombatPage } from './combat.page';

const routes: Routes = [
  {
    path: '',
    component: CombatPage,
    children: [
      {
        path: 'loadout',
        loadChildren: () => import('./loadout/loadout.module').then( m => m.LoadoutPageModule)
      },
      {
        path: 'threats',
        loadChildren: () => import('./threats/threats.module').then( m => m.ThreatsPageModule)
      },
      {
        path: 'dungeons',
        loadChildren: () => import('./dungeons/dungeons.module').then( m => m.DungeonsPageModule)
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'loadout'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CombatPageRoutingModule {}
