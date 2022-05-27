import { MaTypeUtil } from './ma-type-util';

export class MaEnvironmentApi {

  private constructor() {
  }

  public static isAppEnvironment(): boolean {
    const mountValue: any = (window as any).__MICRO_APP_ENVIRONMENT__;
    if (MaTypeUtil.isBoolean(mountValue)) {
      return mountValue;
    }
    return false;
  }

  public static nonAppEnvironment(): boolean {
    return !MaEnvironmentApi.isAppEnvironment();
  }

  public static isAppBaseApplication(): boolean {
    const mountValue: any = (window as any).__MICRO_APP_BASE_APPLICATION__;
    if (MaTypeUtil.isBoolean(mountValue)) {
      return mountValue;
    }
    return false;
  }

  public static nonAppBaseApplication(): boolean {
    return !MaEnvironmentApi.isAppBaseApplication();
  }

  public static getAppName(): string {
    const mountValue: any = (window as any).__MICRO_APP_NAME__;
    if (MaTypeUtil.isString(mountValue)) {
      return mountValue;
    }
    return '';
  }

  public static getAppPublicPath(): string {
    const mountValue: any = (window as any).__MICRO_APP_PUBLIC_PATH__;
    if (MaTypeUtil.isString(mountValue)) {
      return mountValue;
    }
    return '';
  }

  public static getAppBaseRoute(): string {
    const mountValue: any = (window as any).__MICRO_APP_BASE_ROUTE__;
    if (MaTypeUtil.isString(mountValue)) {
      return mountValue;
    }
    return '';
  }

}
