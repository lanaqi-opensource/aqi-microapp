import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Page0Component } from './page0/page0.component';
import { Page6Component } from './page6/page6.component';

const routes: Routes = [
  {
    path: 'page0',
    component: Page0Component,
  },
  {
    path: 'page6',
    component: Page6Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
