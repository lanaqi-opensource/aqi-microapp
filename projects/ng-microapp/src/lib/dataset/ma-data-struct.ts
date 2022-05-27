import { MaDataRecord } from './ma-data-record';

export interface MaDataStruct extends MaDataRecord {

  readonly internalMode: boolean;

  readonly internalData: MaDataRecord;

  readonly externalData: MaDataRecord;

}
