import { Provider } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { MaEnvironmentApi } from '../common/ma-environment.api';
import { MaTypeUtil } from '../common/ma-type-util';

export class MaLocationUtil {

  private constructor() {
  }

  private static buildAppBaseHref(baseRoute?: string): Provider {
    return {
      provide: APP_BASE_HREF,
      useValue: MaTypeUtil.nonEmptyString(MaEnvironmentApi.getAppBaseRoute()) ? MaEnvironmentApi.getAppBaseRoute() : (MaTypeUtil.nonEmptyString(baseRoute) ? baseRoute : '/'),
    } as Provider;
  }

  private static buildPathLocationStrategy(): Provider {
    return {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    } as Provider;
  }

  private static buildHashLocationStrategy(): Provider {
    return {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    } as Provider;
  }

  public static forPath(baseRoute?: string): Provider[] {
    return [
      MaLocationUtil.buildPathLocationStrategy(),
      MaLocationUtil.buildAppBaseHref(baseRoute),
    ];
  }

  public static forHash(baseRoute?: string): Provider[] {
    return [
      MaLocationUtil.buildHashLocationStrategy(),
      MaLocationUtil.buildAppBaseHref(baseRoute),
    ];
  }

}
