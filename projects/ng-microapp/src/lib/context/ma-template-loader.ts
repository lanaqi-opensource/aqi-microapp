import { TemplateRef } from '@angular/core';

import { MaFrameComponent } from './ma-frame.component';

export interface MaTemplateLoader {

  (frameComponent: MaFrameComponent): TemplateRef<void> | undefined;

}
