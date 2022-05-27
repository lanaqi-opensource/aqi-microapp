import { MaFrameEvent } from './ma-frame-event';

export interface MaFrameHandler {

  (frameEvent: MaFrameEvent): void;

}
