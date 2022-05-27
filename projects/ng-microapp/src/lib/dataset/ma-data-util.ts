import { MaTypeUtil } from '../common/ma-type-util';

import { MaDataRecord } from './ma-data-record';

export class MaDataUtil {

  private constructor() {
  }

  public static mergeDataRecord(originData?: MaDataRecord, targetData?: MaDataRecord): MaDataRecord {
    if (MaTypeUtil.isObject(originData) && MaTypeUtil.isObject(targetData)) {
      const dataRecord: MaDataRecord = {};
      for (const propertyKey in targetData) {
        // noinspection JSUnfilteredForInLoop
        if (MaTypeUtil.nonUndefined(targetData[propertyKey])) {
          // noinspection JSUnfilteredForInLoop
          dataRecord[propertyKey] = targetData[propertyKey];
        }
      }
      return {
        ...originData,
        ...dataRecord,
      } as MaDataRecord;
    }
    if (MaTypeUtil.isObject(originData)) {
      return originData as MaDataRecord;
    }
    if (MaTypeUtil.isObject(targetData)) {
      return targetData as MaDataRecord;
    }
    return {} as MaDataRecord;
  }

}
