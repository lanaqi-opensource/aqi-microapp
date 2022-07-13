import { ModuleWithProviders, NgModule } from '@angular/core';

import { MaLocationUtil } from '../support/ma-location-util';
import { MaSubService } from '../support/ma-sub.service';

import { MaContextModule } from './ma-context.module';

@NgModule({
  schemas: [],
  declarations: [],
  imports: [
    MaContextModule,
  ],
  exports: [],
  providers: [
    MaSubService,
  ],
})
export class MaSubModule {

  public static forPath(baseRoute?: string): ModuleWithProviders<MaSubModule> {
    return {
      ngModule: MaSubModule,
      providers: MaLocationUtil.forPath(baseRoute),
    } as ModuleWithProviders<MaSubModule>;
  }

  public static forHash(baseRoute?: string): ModuleWithProviders<MaSubModule> {
    return {
      ngModule: MaSubModule,
      providers: MaLocationUtil.forHash(baseRoute),
    } as ModuleWithProviders<MaSubModule>;
  }

}
