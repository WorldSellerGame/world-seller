import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MercantilePage } from './mercantile.page';

const routes: Routes = [
  {
    path: '',
    component: MercantilePage,
    children: [
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
      },
      {
        path: 'stockpile',
        loadChildren: () => import('./stockpile/stockpile.module').then( m => m.StockpilePageModule)
      },
      {
        path: 'workers',
        loadChildren: () => import('./workers/workers.module').then( m => m.WorkersPageModule)
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'shop'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MercantilePageRoutingModule {}
