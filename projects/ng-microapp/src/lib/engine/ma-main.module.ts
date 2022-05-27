import { ModuleWithProviders, NgModule } from '@angular/core';

import { MaLocationUtil } from '../context/ma-location-util';

import { MaMainService } from '../support/ma-main.service';

import { MaContextModule } from './ma-context.module';

@NgModule({
  schemas: [],
  declarations: [],
  imports: [
    MaContextModule,
  ],
  exports: [],
  providers: [
    MaMainService,
  ],
})
export class MaMainModule {

  public static forPath(baseRoute?: string): ModuleWithProviders<MaMainModule> {
    return {
      ngModule: MaMainModule,
      providers: MaLocationUtil.forPath(baseRoute),
    } as ModuleWithProviders<MaMainModule>;
  }

  public static forHash(baseRoute?: string): ModuleWithProviders<MaMainModule> {
    return {
      ngModule: MaMainModule,
      providers: MaLocationUtil.forHash(baseRoute),
    } as ModuleWithProviders<MaMainModule>;
  }

}
