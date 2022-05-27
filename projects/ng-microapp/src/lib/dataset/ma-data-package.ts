import { MaTypeUtil } from '../common/ma-type-util';

import { MaDataRecord } from './ma-data-record';
import { MaDataStruct } from './ma-data-struct';

export class MaDataPackage {

  private readonly internalMode: boolean;

  private readonly internalData: MaDataRecord;

  private readonly externalData: MaDataRecord;

  private constructor(internalMode: boolean, internalData: MaDataRecord, externalData: MaDataRecord) {
    this.internalMode = internalMode;
    this.internalData = internalData;
    this.externalData = externalData;
  }

  public isInternal(): boolean {
    return this.internalMode;
  }

  public getInternal(): MaDataRecord {
    return this.internalData;
  }

  public getExternal(): MaDataRecord {
    return this.externalData;
  }

  public toRecord(): MaDataStruct {
    return {
      internalMode: this.internalMode ?? false,
      internalData: this.internalData ?? {} as MaDataRecord,
      externalData: this.externalData ?? {} as MaDataRecord,
    } as MaDataStruct;
  }

  public static buildPackage(dataStruct: MaDataStruct | undefined | null): MaDataPackage {
    if (MaTypeUtil.isObject(dataStruct)) {
      return new MaDataPackage(
        dataStruct?.internalMode ?? false,
        dataStruct?.internalData ?? {} as MaDataRecord,
        dataStruct?.externalData ?? {} as MaDataRecord,
      );
    } else {
      return new MaDataPackage(false, {} as MaDataRecord, {} as MaDataRecord);
    }
  }

  public static buildInternal(internalData: MaDataRecord, externalData?: MaDataRecord): MaDataPackage {
    return MaDataPackage.buildPackage({
      internalMode: true,
      internalData: internalData,
      externalData: externalData ?? {} as MaDataRecord,
    } as MaDataStruct);
  }

  public static buildExternal(externalData: MaDataRecord): MaDataPackage {
    return MaDataPackage.buildPackage({
      internalMode: false,
      internalData: {} as MaDataRecord,
      externalData: externalData,
    } as MaDataStruct);
  }

}
