import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

import { MaMainModule } from '../../../ng-microapp/src/lib/engine/ma-main.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Page0Component } from './page0/page0.component';
import { Page6Component } from './page6/page6.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    Page0Component,
    Page6Component,
  ],
  imports: [
    BrowserModule,
    // todo 主应用引入 BrowserAnimationsModule 模块则会导致 micro-app 的 afterhidden 事件不会触发
    // BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NzButtonModule,
    NzInputModule,
    NzSpinModule,
    NzIconModule,
    NzResultModule,
    MaMainModule.forPath(),
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
