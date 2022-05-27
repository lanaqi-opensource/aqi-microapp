import { NgZone } from '@angular/core';

export interface MaBootstrapOption {

  readonly ngZone: NgZone | 'zone.js' | 'noop';

  readonly ngZoneEventCoalescing: boolean;

  readonly  ngZoneRunCoalescing: boolean;

}
