import { Data } from '@angular/router';

import { MaFrameModel } from './ma-frame-model';

export interface MaActivatedRoute extends Data {

  routeMode: boolean;

  frameModel: MaFrameModel;

}
