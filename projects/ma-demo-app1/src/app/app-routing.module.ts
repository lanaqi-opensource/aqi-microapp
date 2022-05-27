import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Page0Component } from './page0/page0.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';

const routes: Routes = [
  {
    path: 'page0',
    component: Page0Component,
  },
  {
    path: 'page1',
    component: Page1Component,
  },
  {
    path: 'page2',
    component: Page2Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
