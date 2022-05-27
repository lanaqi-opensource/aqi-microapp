import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Page0Component } from './page0/page0.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { Sub1Component } from './sub1/sub1.component';
import { Sub2Component } from './sub2/sub2.component';
import { Outlet1Component } from './outlet1/outlet1.component';
import { Outlet2Component } from './outlet2/outlet2.component';

const routes: Routes = [
  {
    path: 'page0',
    component: Page0Component,
  },
  {
    path: 'page3',
    component: Page3Component,
    children: [
      {
        path: 'outlet1',
        outlet: 'target',
        component: Outlet1Component,
      },
      {
        path: 'outlet2',
        outlet: 'target',
        component: Outlet2Component,
      },
    ],
  },
  {
    path: 'page4',
    component: Page4Component,
    children: [
      {
        path: 'sub1',
        component: Sub1Component,
      },
      {
        path: 'sub2',
        component: Sub2Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
