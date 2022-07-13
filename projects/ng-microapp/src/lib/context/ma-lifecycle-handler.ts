import { MaLifecycleEvent } from './ma-lifecycle-event';

export interface MaLifecycleHandler {

  (lifecycleEvent: MaLifecycleEvent): void;

}
