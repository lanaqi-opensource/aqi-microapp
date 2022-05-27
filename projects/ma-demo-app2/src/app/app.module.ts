import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

import { MaSubModule } from '../../../ng-microapp/src/lib/engine/ma-sub.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Page0Component } from './page0/page0.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { Sub1Component } from './sub1/sub1.component';
import { Sub2Component } from './sub2/sub2.component';
import { Outlet1Component } from './outlet1/outlet1.component';
import { Outlet2Component } from './outlet2/outlet2.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    Page0Component,
    Page3Component,
    Page4Component,
    Sub1Component,
    Sub2Component,
    Outlet1Component,
    Outlet2Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NzButtonModule,
    NzInputModule,
    MaSubModule.forPath(),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: zh_CN
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
