import { MaFrameConfig } from '../context/ma-frame-config';

export interface MaGlobalEvent {

  customEvent: CustomEvent;

  frameConfigs: MaFrameConfig[];

}
