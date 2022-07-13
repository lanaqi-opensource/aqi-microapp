import { MaTypeUtil } from '../common/ma-type-util';

import { MaDataRecord } from '../dataset/ma-data-record';

import { MaInfoMessage } from './ma-info-message';
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

  public toMessage(): MaInfoMessage {
    return {
      dataHeader: this.dataHeader ?? MaInfoHeader.unknown,
      dataContent: this.dataContent ?? {} as MaDataRecord,
    } as MaInfoMessage;
  }

  public static buildPackage(infoMessage: MaInfoMessage | undefined | null): MaInfoPackage {
    if (MaTypeUtil.isObject(infoMessage)) {
      return new MaInfoPackage(
        infoMessage?.dataHeader ?? MaInfoHeader.unknown,
        infoMessage?.dataContent ?? {} as MaDataRecord,
      );
    } else {
      return new MaInfoPackage(MaInfoHeader.unknown, {} as MaDataRecord);
    }
  }

}
