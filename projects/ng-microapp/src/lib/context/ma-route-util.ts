import { Data, Route, Routes } from '@angular/router';

import { MaTypeUtil } from '../common/ma-type-util';

import { MaFrameModel } from './ma-frame-model';
import { MaActivatedRoute } from './ma-activated-route';
import { MaEmptyComponent } from './ma-empty.component';
import { MaFrameComponent } from './ma-frame.component';

export class MaRouteUtil {

  public static readonly ANY_ROUTE_PATH: string = '**';

  public static readonly APP_ROUTE_PATH: string = 'app';

  private static readonly FULL_PATH_MATCH = 'full';

  private constructor() {
  }

  public static buildEmptyRoute(): Route {
    return {
      path: MaRouteUtil.ANY_ROUTE_PATH,
      data: {} as Data,
      component: MaEmptyComponent,
      children: [] as Routes,
    } as Route;
  }

  public static buildRedirectRoute(appName: string): Route {
    return {
      path: MaRouteUtil.ANY_ROUTE_PATH,
      redirectTo: `/${MaRouteUtil.APP_ROUTE_PATH}/${appName}/`,
      pathMatch: MaRouteUtil.FULL_PATH_MATCH,
    } as Route;
  }

  public static buildFrameRoute(frameModel: MaFrameModel): Route {
    return {
      path: frameModel.appName ?? '',
      data: {
        routeMode: true,
        frameModel: frameModel,
      } as MaActivatedRoute,
      component: MaFrameComponent,
      children: [
        MaRouteUtil.buildEmptyRoute(),
      ] as Routes,
    } as Route;
  }

  public static buildFrameRoutes(frameModels: MaFrameModel[]): Routes {
    const frameRoutes: Routes = [];
    if (MaTypeUtil.nonEmptyArray(frameModels)) {
      frameModels.forEach(frameModel => {
        frameRoutes.push(MaRouteUtil.buildFrameRoute(frameModel));
      });
      frameRoutes.push(this.buildRedirectRoute(frameModels[0]?.appName ?? ''));
    }
    return frameRoutes;
  }

  public static buildRootRoutes(frameModels: MaFrameModel[]): Routes {
    return [
      {
        path: MaRouteUtil.APP_ROUTE_PATH,
        children: MaRouteUtil.buildFrameRoutes(frameModels),
      } as Route,
    ];
  }

}
