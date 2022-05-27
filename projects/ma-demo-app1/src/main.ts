import { NgModuleRef } from '@angular/core';

import { MaBootstrapApi } from '../../ng-microapp/src/lib/common/ma-bootstrap.api';

import { AppModule } from './app/app.module';

import { environment } from './environments/environment';

MaBootstrapApi.bootstrap(
  AppModule, environment.production,
  false, false, false,
  (appRef: NgModuleRef<AppModule>) => {
  }
);
