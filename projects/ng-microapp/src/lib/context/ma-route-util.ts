import { Data, Route, Routes } from '@angular/router';

import { MaTypeUtil } from '../common/ma-type-util';

import { MaFrameConfig } from './ma-frame-config';
import { MaFrameDefine } from './ma-frame-define';
import { MaFrameModel } from './ma-frame-model';
import { MaFrameRoute } from './ma-frame-route';
import { MaEmptyComponent } from './ma-empty.component';
import { MaFrameComponent } from './ma-frame.component';
import { MaFrameUtil } from './ma-frame-util';

export class MaRouteUtil {

  public static MATCH_ANY_ROUTE: string = '**';

  public static MATCH_APP_ROUTE: string = 'app';

  private constructor() {
  }

  public static buildEmptyRoute(): Route {
    return {
      path: MaRouteUtil.MATCH_ANY_ROUTE,
      data: {} as Data,
      component: MaEmptyComponent,
      children: [],
    } as Route;
  }

  public static buildFrameRoute(frameModel: MaFrameModel, emptyComponent: boolean = true, pathPrefix: string = ''): Route {
    const path: string = MaTypeUtil.nonEmptyString(pathPrefix) ? `${pathPrefix}-${frameModel.appName}` : frameModel.appName ?? '';
    const data: MaFrameRoute = {
      routeMode: true,
      frameModel: frameModel,
    };
    const children = emptyComponent ? [MaRouteUtil.buildEmptyRoute()] : [];
    return {
      path: path,
      data: data,
      component: MaFrameComponent,
      children: children,
    } as Route;
  }

  public static buildFrameRoutes(frameModels: MaFrameModel[], emptyComponent: boolean = true, pathPrefix: string = ''): Routes {
    const frameRoutes: Routes = [];
    if (MaTypeUtil.nonEmptyArray(frameModels)) {
      frameModels.forEach(frameModel => {
        frameRoutes.push(MaRouteUtil.buildFrameRoute(frameModel, emptyComponent, pathPrefix));
      });
    }
    return frameRoutes;
  }

  public static buildRootRoutes(frameModels: MaFrameModel[], emptyComponent: boolean = true, pathPrefix: string = '', rootPath: string = ''): Routes {
    const frameRoutes: Routes = MaRouteUtil.buildFrameRoutes(frameModels, emptyComponent, pathPrefix);
    if (emptyComponent) {
      frameRoutes.push(MaRouteUtil.buildEmptyRoute());
    }
    const path: string = MaTypeUtil.nonEmptyString(rootPath) ? rootPath : MaRouteUtil.MATCH_APP_ROUTE;
    return [
      {
        path: path,
        children: frameRoutes,
      } as Route,
    ];
  }

  public static buildModelRoutes(frameModels: MaFrameModel[], emptyComponent: boolean = true, pathPrefix: string = '', rootPath: string = ''): Routes {
    const modelRoutes: Routes = MaRouteUtil.buildRootRoutes(frameModels, emptyComponent, pathPrefix, rootPath);
    if (emptyComponent) {
      modelRoutes.push(MaRouteUtil.buildEmptyRoute());
    }
    return modelRoutes;
  }

  public static buildConfigRoutes(frameConfigs: MaFrameConfig[], frameDefine: MaFrameDefine = {}, emptyComponent: boolean = true, pathPrefix: string = '', rootPath: string = ''): Routes {
    return MaRouteUtil.buildModelRoutes(MaFrameUtil.buildFrameModels(frameConfigs, frameDefine), emptyComponent, pathPrefix, rootPath);
  }

}
