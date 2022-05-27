import { MaSubApi } from '../common/ma-sub.api';

import { MaDataRecord } from '../dataset/ma-data-record';
import { MaDataStruct } from '../dataset/ma-data-struct';
import { MaDataPackage } from '../dataset/ma-data-package';

import { MaInfoStruct } from '../inside/ma-info-struct';
import { MaInfoPackage } from '../inside/ma-info-package';

export class MaSubUtil {

  private constructor() {
  }

  public static setAppData(dataPackage: MaDataPackage): void {
    MaSubApi.dispatch(dataPackage.toRecord());
  }

  public static setAppExternal(externalData: MaDataRecord): void {
    MaSubUtil.setAppData(MaDataPackage.buildExternal(externalData));
  }

  public static setAppInternal(infoPackage: MaInfoPackage, externalData?: MaDataRecord): void {
    MaSubUtil.setAppData(MaDataPackage.buildInternal(infoPackage.toMessage(), externalData));
  }

  public static getAppData(): MaDataPackage {
    return MaDataPackage.buildPackage(MaSubApi.getData() as MaDataStruct);
  }

  public static getAppExternal(): MaDataRecord {
    return MaSubUtil.getAppData().getExternal();
  }

  public static getAppInternal(): MaInfoPackage {
    return MaInfoPackage.buildPackage(MaSubUtil.getAppData().getInternal() as MaInfoStruct)
  }

  public static setGlobalData(dataPackage: MaDataPackage): void {
    MaSubApi.setGlobalData(dataPackage.toRecord());
  }

  public static setGlobalExternal(externalData: MaDataRecord): void {
    MaSubUtil.setGlobalData(MaDataPackage.buildExternal(externalData));
  }

  public static setGlobalInternal(infoPackage: MaInfoPackage, externalData?: MaDataRecord): void {
    MaSubUtil.setGlobalData(MaDataPackage.buildInternal(infoPackage.toMessage(), externalData));
  }

  public static getGlobalData(): MaDataPackage {
    return MaDataPackage.buildPackage(MaSubApi.getGlobalData() as MaDataStruct);
  }

  public static getGlobalExternal(): MaDataRecord {
    return MaSubUtil.getGlobalData().getExternal();
  }

  public static getGlobalInternal(): MaInfoPackage {
    return MaInfoPackage.buildPackage(MaSubUtil.getGlobalData().getInternal() as MaInfoStruct)
  }

}
