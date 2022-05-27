import { MaGlobalEvent } from './ma-global-event';

export interface MaGlobalHandler {

  (globalEvent: MaGlobalEvent): void

}
