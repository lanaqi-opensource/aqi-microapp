import { MaDataRecord } from '../dataset/ma-data-record';

export interface MaFetchType {

  (url: string, options: MaDataRecord, appName: string | null): Promise<string>;

}
