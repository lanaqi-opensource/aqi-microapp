import { MaDataRecord } from './ma-data-record';

export interface MaDataHandler {

  (dataRecord: MaDataRecord): void;

}
