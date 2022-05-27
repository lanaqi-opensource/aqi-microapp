import { MaMainApi } from '../common/ma-main.api';

import { MaDataRecord } from '../dataset/ma-data-record';
import { MaDataStruct } from '../dataset/ma-data-struct';
import { MaDataPackage } from '../dataset/ma-data-package';

import { MaInfoStruct } from '../inside/ma-info-struct';
import { MaInfoPackage } from '../inside/ma-info-package';

export class MaMainUtil {

  private constructor() {
  }

  public static setAppData(appName: string, dataPackage: MaDataPackage): void {
    MaMainApi.setData(appName, dataPackage.toRecord());
  }

  public static setAppExternal(appName: string, externalData: MaDataRecord): void {
    MaMainUtil.setAppData(appName, MaDataPackage.buildExternal(externalData));
  }

  public static setAppInternal(appName: string, infoPackage: MaInfoPackage, externalData?: MaDataRecord): void {
    MaMainUtil.setAppData(appName, MaDataPackage.buildInternal(infoPackage.toMessage(), externalData));
  }

  public static getAppData(appName: string, fromBase?: boolean): MaDataPackage {
    return MaDataPackage.buildPackage(MaMainApi.getData(appName, fromBase) as MaDataStruct);
  }

  public static getAppExternal(appName: string, fromBase?: boolean): MaDataRecord {
    return MaMainUtil.getAppData(appName, fromBase).getExternal();
  }

  public static getAppInternal(appName: string, fromBase?: boolean): MaInfoPackage {
    return MaInfoPackage.buildPackage(MaMainUtil.getAppData(appName, fromBase).getInternal() as MaInfoStruct)
  }

  public static setGlobalData(dataPackage: MaDataPackage): void {
    MaMainApi.setGlobalData(dataPackage.toRecord());
  }

  public static setGlobalExternal(externalData: MaDataRecord): void {
    MaMainUtil.setGlobalData(MaDataPackage.buildExternal(externalData));
  }

  public static setGlobalInternal(infoPackage: MaInfoPackage, externalData?: MaDataRecord): void {
    MaMainUtil.setGlobalData(MaDataPackage.buildInternal(infoPackage.toMessage(), externalData));
  }

  public static getGlobalData(): MaDataPackage {
    return MaDataPackage.buildPackage(MaMainApi.getGlobalData() as MaDataStruct);
  }

  public static getGlobalExternal(): MaDataRecord {
    return MaMainUtil.getGlobalData().getExternal();
  }

  public static getGlobalInternal(): MaInfoPackage {
    return MaInfoPackage.buildPackage(MaMainUtil.getGlobalData().getInternal() as MaInfoStruct)
  }

}
