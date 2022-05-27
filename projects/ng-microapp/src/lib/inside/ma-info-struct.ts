import { MaDataRecord } from '../dataset/ma-data-record';

import { MaInfoHeader } from './ma-info-header';

export interface MaInfoStruct extends MaDataRecord {

  readonly dataHeader: MaInfoHeader;

  readonly dataContent: MaDataRecord;

}
