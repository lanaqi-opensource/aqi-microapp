import { MaLifecycleHandler } from './ma-lifecycle-handler';
import { MaTemplateLoader } from './ma-template-loader';

export interface MaFrameDefine {

  errorTemplateEnable?: boolean;

  errorTemplateLoader?: MaTemplateLoader;

  onCreatedHandler?: MaLifecycleHandler;

  onBeforeMountHandler?: MaLifecycleHandler;

  onMountedHandler?: MaLifecycleHandler;

  onUnmountHandler?: MaLifecycleHandler;

  onErrorHandler?: MaLifecycleHandler;

  onAfterHiddenHandler?: MaLifecycleHandler;

  onBeforeShowHandler?: MaLifecycleHandler;

  onAfterShowHandler?: MaLifecycleHandler;

  onBeforeLoadHandler?: MaLifecycleHandler;

  onAfterLoadHandler?: MaLifecycleHandler;

}
