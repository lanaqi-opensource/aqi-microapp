import { getActiveApps, getAllApps, pureCreateElement, removeDomScope, unmountAllApps, unmountApp, version } from '@micro-zoe/micro-app';
import { unmountAppParams } from '@micro-zoe/micro-app/micro_app';

export class MaGlobalApi {

  public static version: string = version;

  private constructor() {
  }

  public static pureCreateElement<K extends keyof HTMLElementTagNameMap>(tagName: K, creationOptions?: ElementCreationOptions): HTMLElementTagNameMap[K] {
    return pureCreateElement(tagName, creationOptions);
  }

  public static removeDomScope(): void {
    removeDomScope();
  }

  public static getActiveApps(excludeHidden?: boolean): string[] {
    return getActiveApps(excludeHidden);
  }

  public static getAllApps(): string[] {
    return getAllApps();
  }

  public static unmountApp(appName: string, appParams?: unmountAppParams): Promise<void> {
    return unmountApp(appName, appParams);
  }

  public static unmountAllApps(appParams?: unmountAppParams): Promise<void> {
    return unmountAllApps(appParams);
  }

}
