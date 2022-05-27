import { MaTypeUtil } from '../common/ma-type-util';

import { MaFrameConfig } from './ma-frame-config';
import { MaFrameDefine } from './ma-frame-define';
import { MaFrameModel } from './ma-frame-model';

export class MaFrameUtil {

  private constructor() {
  }

  public static buildFrameModel(frameConfig: MaFrameConfig, frameDefine: MaFrameDefine = {}): MaFrameModel {
    return {
      ...frameConfig,
      ...frameDefine,
    } as MaFrameModel;
  }

  public static buildFrameModels(frameConfigs: MaFrameConfig[], frameDefine: MaFrameDefine = {}): MaFrameModel[] {
    const frameModels: MaFrameModel[] = [];
    if (MaTypeUtil.nonEmptyArray(frameConfigs)) {
      frameConfigs.forEach(frameConfig => {
        frameModels.push(MaFrameUtil.buildFrameModel(frameConfig, frameDefine));
      });
    }
    return frameModels;
  }

}
