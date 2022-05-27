import { MaTypeUtil } from '../common/ma-type-util';

import { MaDataRecord } from '../dataset/ma-data-record';

import { MaInfoStruct } from './ma-info-struct';
import { MaInfoHeader } from './ma-info-header';

export class MaInfoPackage {

  private readonly dataHeader: MaInfoHeader;

  private readonly dataContent: MaDataRecord;

  private constructor(dataHeader: MaInfoHeader, dataContent: MaDataRecord) {
    this.dataHeader = dataHeader;
    this.dataContent = dataContent;
  }

  public getHeader(): MaInfoHeader {
    return this.dataHeader;
  }

  public getContent(): MaDataRecord {
    return this.dataContent;
  }

  public toMessage(): MaInfoStruct {
    return {
      dataHeader: this.dataHeader ?? MaInfoHeader.unknown,
      dataContent: this.dataContent ?? {} as MaDataRecord,
    } as MaInfoStruct;
  }

  public static buildPackage(infoStruct: MaInfoStruct | undefined | null): MaInfoPackage {
    if (MaTypeUtil.isObject(infoStruct)) {
      return new MaInfoPackage(
        infoStruct?.dataHeader ?? MaInfoHeader.unknown,
        infoStruct?.dataContent ?? {} as MaDataRecord,
      );
    } else {
      return new MaInfoPackage(MaInfoHeader.unknown, {} as MaDataRecord);
    }
  }

}
