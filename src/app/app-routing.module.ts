import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/core/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./pages/core/new/new.module').then( m => m.NewPageModule)
  },
  {
    path: 'game/:slot/settings',
    loadChildren: () => import('./pages/core/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'game/:slot',
    redirectTo: 'game/:slot/resources'
  },
  {
    path: 'game/:slot/resources',
    loadChildren: () => import('./pages/character/resources/resources.module').then( m => m.ResourcesPageModule)
  },
  {
    path: 'game/:slot/inventory',
    loadChildren: () => import('./pages/character/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'game/:slot/equipment',
    loadChildren: () => import('./pages/character/equipment/equipment.module').then( m => m.EquipmentPageModule)
  },
  {
    path: 'game/:slot/mining',
    loadChildren: () => import('./pages/tradeskills/gathering/mining/mining.module').then( m => m.MiningPageModule)
  },
  {
    path: 'game/:slot/fishing',
    loadChildren: () => import('./pages/tradeskills/gathering/fishing/fishing.module').then( m => m.FishingPageModule)
  },
  {
    path: 'game/:slot/foraging',
    loadChildren: () => import('./pages/tradeskills/gathering/foraging/foraging.module').then( m => m.ForagingPageModule)
  },
  {
    path: 'game/:slot/logging',
    loadChildren: () => import('./pages/tradeskills/gathering/logging/logging.module').then( m => m.LoggingPageModule)
  },
  {
    path: 'game/:slot/hunting',
    loadChildren: () => import('./pages/tradeskills/gathering/hunting/hunting.module').then( m => m.HuntingPageModule)
  },
  {
    path: 'game/:slot/blacksmithing',
    loadChildren: () => import('./pages/tradeskills/refining/blacksmith/blacksmith.module').then( m => m.BlacksmithPageModule)
  },
  {
    path: 'game/:slot/weaving',
    loadChildren: () => import('./pages/tradeskills/refining/weaving/weaving.module').then( m => m.WeavingPageModule)
  },
  {
    path: 'game/:slot/alchemy',
    loadChildren: () => import('./pages/tradeskills/refining/alchemy/alchemy.module').then( m => m.AlchemyPageModule)
  },
  {
    path: 'game/:slot/cooking',
    loadChildren: () => import('./pages/tradeskills/refining/cooking/cooking.module').then( m => m.CookingPageModule)
  },
  {
    path: 'game/:slot/jewelcrafting',
    loadChildren: () => import('./pages/tradeskills/refining/jewelcrafting/jewelcrafting.module').then( m => m.JewelcraftingPageModule)
  },
  {
    path: 'game/:slot/farming',
    loadChildren: () => import('./pages/tradeskills/peripheral/farming/farming.module').then( m => m.FarmingPageModule)
  },
  {
    path: 'game/:slot/transmutation',
    loadChildren: () => import('./pages/tradeskills/peripheral/prospecting/prospecting.module').then( m => m.ProspectingPageModule)
  },
  {
    path: 'game/:slot/mercantile',
    loadChildren: () => import('./pages/tradeskills/peripheral/mercantile/mercantile.module').then( m => m.MercantilePageModule)
  },
  {
    path: 'game/:slot/combat',
    loadChildren: () => import('./pages/tradeskills/peripheral/combat/combat.module').then( m => m.CombatPageModule)
  },
  {
    path: 'game/:slot/achievements',
    loadChildren: () => import('./pages/character/achievements/achievements.module').then( m => m.AchievementsPageModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
