import { Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationExtras, Router, Routes, UrlCreationOptions, UrlTree } from '@angular/router';

import { MaTypeUtil } from '../common/ma-type-util';

@Injectable({
  providedIn: 'root',
})
export class MaRouteService {

  private originRoutes: Routes = [];

  public constructor(private ngRouter: Router) {
  }

  private backupRoutes(): void {
    if (MaTypeUtil.isEmptyArray(this.originRoutes)) {
      const configRoutes: Routes = this.getConfigRoutes();
      if (MaTypeUtil.nonEmptyArray(configRoutes)) {
        configRoutes.forEach(configRoute => {
          this.originRoutes.push(Object.assign({}, configRoute));
        });
      }
    }
  }

  public resetRoutes(mergeRoutes: Routes): void {
    this.backupRoutes();
    const cloneRoutes: Routes = [];
    if (MaTypeUtil.nonEmptyArray(this.originRoutes)) {
      this.originRoutes.forEach(originRoute => {
        cloneRoutes.push(Object.assign({}, originRoute));
      });
    }
    if (MaTypeUtil.nonEmptyArray(mergeRoutes)) {
      cloneRoutes.push(...mergeRoutes);
    }
    if (MaTypeUtil.nonEmptyArray(cloneRoutes)) {
      this.ngRouter.resetConfig(cloneRoutes);
    }
  }

  public recoverRoutes(): void {
    this.backupRoutes();
    if (MaTypeUtil.nonEmptyArray(this.originRoutes)) {
      this.ngRouter.resetConfig(this.originRoutes);
    }
  }

  public getConfigRoutes(): Routes {
    return this.ngRouter.config;
  }

  public getOriginRoutes(): Routes {
    return this.originRoutes;
  }

  public getCurrentUrl(): string {
    return this.ngRouter.url;
  }

  public createUrlTree(commands: any[], navigationExtras?: UrlCreationOptions): UrlTree {
    return this.ngRouter.createUrlTree(commands, navigationExtras);
  }

  public parseUrl(url: string): UrlTree {
    return this.ngRouter.parseUrl(url);
  }

  public serializeUrl(url: UrlTree): string {
    return this.ngRouter.serializeUrl(url);
  }

  public navigateByCommands(commands: any[], extras?: NavigationExtras): void {
    // noinspection JSIgnoredPromiseFromCall
    this.ngRouter.navigate(commands, extras);
  }

  public navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
    // noinspection JSIgnoredPromiseFromCall
    this.ngRouter.navigateByUrl(url, extras);
  }

}
