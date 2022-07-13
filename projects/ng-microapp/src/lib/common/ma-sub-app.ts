import { EventCenterForMicroApp } from '@micro-zoe/micro-app';

export interface MaSubApp extends EventCenterForMicroApp {

  readonly rawWindow?: string;

  readonly rawDocument?: string;

  removeDomScope(): void;

  pureCreateElement<K extends keyof HTMLElementTagNameMap>(tagName: K, creationOptions?: ElementCreationOptions): HTMLElementTagNameMap[K];

}
