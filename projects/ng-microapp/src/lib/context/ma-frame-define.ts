import { TemplateRef } from '@angular/core';

import { MaFrameHandler } from './ma-frame-handler';

export interface MaFrameDefine {

  errorTemplate?: TemplateRef<void>;

  errorSupported?: boolean;

  onCreatedHandler?: MaFrameHandler;

  onBeforeMountHandler?: MaFrameHandler;

  onMountedHandler?: MaFrameHandler;

  onUnmountHandler?: MaFrameHandler;

  onErrorHandler?: MaFrameHandler;

  onAfterHiddenHandler?: MaFrameHandler;

  onBeforeShowHandler?: MaFrameHandler;

  onAfterShowHandler?: MaFrameHandler;

  onBeforeLoadHandler?: MaFrameHandler;

  onAfterLoadHandler?: MaFrameHandler;

}
