import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaTypeUtil } from '../common/ma-type-util';

import { MaEmptyComponent } from '../context/ma-empty.component';
import { MaFrameComponent } from '../context/ma-frame.component';
import { MaRouteService } from '../context/ma-route.service';
import { MaLocationUtil } from '../context/ma-location-util';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    MaEmptyComponent,
    MaFrameComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MaEmptyComponent,
    MaFrameComponent,
  ],
  providers: [
    MaRouteService,
  ],
  // todo if not enable Ivy
  // entryComponents: [
  //   MaEmptyComponent,
  //   MaFrameComponent,
  // ],
})
export class MaContextModule {

  public constructor(private ngZone: NgZone) {
    if (MaTypeUtil.isSafe(this.ngZone)) {
      (window as any).ngZone = this.ngZone;
    }
  }

  public static forPath(baseRoute?: string): ModuleWithProviders<MaContextModule> {
    return {
      ngModule: MaContextModule,
      providers: MaLocationUtil.forPath(baseRoute),
    } as ModuleWithProviders<MaContextModule>;
  }

  public static forHash(baseRoute?: string): ModuleWithProviders<MaContextModule> {
    return {
      ngModule: MaContextModule,
      providers: MaLocationUtil.forHash(baseRoute),
    } as ModuleWithProviders<MaContextModule>;
  }

}
