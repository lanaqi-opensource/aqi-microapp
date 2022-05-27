import { enableProdMode, NgModuleRef, NgZone, Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MaBootstrapOption } from './ma-bootstrap-option';
import { MaEnvironmentApi } from './ma-environment.api';
import { MaTypeUtil } from './ma-type-util';

export class MaBootstrapApi {

  private constructor() {
  }

  public static webpack(): void {
    if (MaEnvironmentApi.isAppEnvironment()) {
      // @ts-ignore
      __webpack_public_path__ = MaEnvironmentApi.getAppPublicPath();
    }
  }

  public static options(ngZoneEventCoalescing: boolean = false, ngZoneRunCoalescing: boolean = false): MaBootstrapOption {
    let ngZone: NgZone | 'zone.js' | 'noop';
    if (MaEnvironmentApi.isAppEnvironment()) {
      const winZone: NgZone = (window as any).ngZone;
      if (MaTypeUtil.isSafe(winZone)) {
        ngZone = winZone;
      } else {
        ngZone = 'noop';
      }
    } else {
      ngZone = 'zone.js';
    }
    return {
      ngZone: ngZone,
      ngZoneEventCoalescing: ngZoneEventCoalescing,
      ngZoneRunCoalescing: ngZoneRunCoalescing,
    } as MaBootstrapOption;
  }

  public static render(mountFunc: Function, unmountFunc: Function): void {
    MaBootstrapApi.webpack();
    if (MaEnvironmentApi.isAppEnvironment()) {
      (window as any)[`micro-app-${MaEnvironmentApi.getAppName()}`] = { mount: mountFunc, unmount: unmountFunc }
    } else {
      mountFunc();
    }
  }

  public static bootstrap<M>(
    ngModule: Type<M>,
    ngMode: boolean,
    ngDestroy: boolean = false,
    ngZoneEventCoalescing: boolean = false,
    ngZoneRunCoalescing: boolean = false,
    ngCallback?: (appRef: NgModuleRef<M>) => void
  ): void {
    if (ngMode) {
      enableProdMode();
    }
    let appRef: NgModuleRef<M> | null = null;
    const mountFunc = async function mount() {
      appRef = await platformBrowserDynamic()
        .bootstrapModule(ngModule, MaBootstrapApi.options(ngZoneEventCoalescing, ngZoneRunCoalescing))
        .catch(error => console.error(error)) as NgModuleRef<M>;
    };
    const unmountFunc = async function unmount() {
      if (MaTypeUtil.isSafe(appRef) && (ngDestroy || MaEnvironmentApi.nonAppEnvironment())) {
        (appRef as NgModuleRef<M>).destroy();
      }
      appRef = null;
    };
    MaBootstrapApi.render(mountFunc, unmountFunc);
    if (MaTypeUtil.isFunction(ngCallback)) {
      (ngCallback as Function)(appRef);
    }
  }

}
