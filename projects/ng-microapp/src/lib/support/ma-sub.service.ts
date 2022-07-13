import { EventEmitter, Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationExtras, UrlTree } from '@angular/router';

import { MaErrorHandler } from '../common/ma-error-handler';
import { MaCompleteHandler } from '../common/ma-complete-handler';
import { MaSubApi } from '../common/ma-sub.api';
import { MaEnvironmentApi } from '../common/ma-environment.api';
import { MaTypeUtil } from '../common/ma-type-util';

import { MaRouteUtil } from '../context/ma-route-util';

import { MaDataRecord } from '../dataset/ma-data-record';
import { MaDataHandler } from '../dataset/ma-data-handler';
import { MaDataStruct } from '../dataset/ma-data-struct';
import { MaDataPackage } from '../dataset/ma-data-package';
import { MaDataUtil } from '../dataset/ma-data-util';

import { MaInfoMessage } from '../inside/ma-info-message';
import { MaInfoHeader } from '../inside/ma-info-header';
import { MaInfoPackage } from '../inside/ma-info-package';

import { MaRouteService } from './ma-route.service';
import { MaSubUtil } from './ma-sub-util';

@Injectable({
  providedIn: 'root',
})
export class MaSubService {

  private frameIsRun: boolean = false;

  private keepAliveUrl: string = '';

  private cacheAppData: MaDataRecord = {};

  private cacheGlobalData: MaDataRecord = {};

  private appDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  private globalDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  public constructor(private routeService: MaRouteService) {
  }

  public sendAppData(externalData: MaDataRecord): void {
    if (this.frameIsRun) {
      this.cacheAppData = externalData;
      MaSubUtil.setAppExternal(externalData);
    }
  }

  public gainAppData(): MaDataRecord {
    if (this.frameIsRun) {
      return MaSubUtil.getAppExternal();
    }
    return {} as MaDataRecord;
  }

  public cleanAppData(): void {
    this.sendAppData({} as MaDataRecord);
  }

  public changeAppData(externalData: MaDataRecord): void {
    this.sendAppData(MaDataUtil.mergeDataRecord(this.cacheAppData, externalData));
  }

  private dispatchAppData(infoPackage: MaInfoPackage): void {
    MaSubUtil.setAppInternal(infoPackage, this.cacheAppData);
  }

  private defaultAppData(dataContent: MaDataRecord): void {
  }

  private acceptAppData(infoPackage: MaInfoPackage): void {
    const dataHeader: MaInfoHeader = infoPackage.getHeader();
    const dataContent: MaDataRecord = infoPackage.getContent();
    switch (dataHeader) {
      case MaInfoHeader.keepAliveAfterHidden:
        this.keepAliveAfterHidden(dataContent);
        break;
      case MaInfoHeader.keepAliveBeforeShow:
        this.keepAliveBeforeShow(dataContent);
        break;
      case MaInfoHeader.unknown:
      default:
        this.defaultAppData(dataContent);
        break;
    }
  }

  private handleAppData(dataRecord: MaDataRecord): void {
    const dataPackage: MaDataPackage = MaDataPackage.buildPackage(dataRecord as MaDataStruct);
    if (dataPackage.isInternal()) {
      this.acceptAppData(MaInfoPackage.buildPackage(dataPackage.getInternal() as MaInfoMessage));
    } else {
      this.appDataEmitter.emit(dataPackage.getExternal());
    }
  }

  public subscribeAppData(dataHandler: MaDataHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.appDataEmitter.subscribe(dataHandler, errorHandler, completeHandler);
  }

  public sendGlobalData(externalData: MaDataRecord): void {
    if (this.frameIsRun) {
      this.cacheGlobalData = externalData;
      MaSubUtil.setGlobalExternal(externalData);
    }
  }

  public gainGlobalData(): MaDataRecord {
    if (this.frameIsRun) {
      return MaSubUtil.getGlobalExternal();
    }
    return {} as MaDataRecord;
  }

  public cleanGlobalData(): void {
    this.sendGlobalData({} as MaDataRecord);
  }

  public changeGlobalData(externalData: MaDataRecord): void {
    this.sendGlobalData(MaDataUtil.mergeDataRecord(this.cacheGlobalData, externalData));
  }

  private dispatchGlobalData(infoPackage: MaInfoPackage): void {
    MaSubUtil.setGlobalInternal(infoPackage, this.cacheGlobalData);
  }

  private defaultGlobalData(dataContent: MaDataRecord): void {
  }

  private acceptGlobalData(infoPackage: MaInfoPackage): void {
    const dataHeader: MaInfoHeader = infoPackage.getHeader();
    const dataContent: MaDataRecord = infoPackage.getContent();
    switch (dataHeader) {
      case MaInfoHeader.unknown:
      default:
        this.defaultGlobalData(dataContent);
        break;
    }
  }

  private handleGlobalData(dataRecord: MaDataRecord): void {
    const dataPackage: MaDataPackage = MaDataPackage.buildPackage(dataRecord as MaDataStruct);
    if (dataPackage.isInternal()) {
      this.acceptGlobalData(MaInfoPackage.buildPackage(dataPackage.getInternal() as MaInfoMessage));
    } else {
      this.globalDataEmitter.emit(dataPackage.getExternal());
    }
  }

  public subscribeGlobalData(dataHandler: MaDataHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalDataEmitter.subscribe(dataHandler, errorHandler, completeHandler);
  }

  private keepAliveAfterHidden(dataContent: MaDataRecord): void {
    let subRoute: string = this.routeService.getCurrentUrl();
    let baseRoute: string = MaEnvironmentApi.getAppBaseRoute();
    if (baseRoute.lastIndexOf('/') === baseRoute.length - 1) {
      baseRoute = baseRoute.substr(0, baseRoute.length - 1);
    }
    if (subRoute.indexOf('/') === 0) {
      subRoute = subRoute.substr(1, subRoute.length);
    }
    this.keepAliveUrl = `${baseRoute}/${subRoute}`;
  }

  private keepAliveBeforeShow(dataContent: MaDataRecord): void {
    const navigateUrl: string = this.keepAliveUrl;
    if (MaTypeUtil.nonEmptyString(navigateUrl)) {
      this.navigateByUrl(navigateUrl);
    }
    this.keepAliveUrl = '';
  }

  public navigateByCommands(commands: any[], extras?: NavigationExtras): void {
    if (this.frameIsRun) {
      this.dispatchAppData(MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.navigateByCommands,
        dataContent: {
          commands: commands,
          extras: extras,
        } as MaDataRecord,
      } as MaInfoMessage));
    } else {
      this.routeService.navigateByCommands(commands, extras);
    }
  }

  public navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
    if (this.frameIsRun) {
      this.dispatchAppData(MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.navigateByUrl,
        dataContent: {
          url: url,
          extras: extras,
        } as MaDataRecord,
      } as MaInfoMessage));
    } else {
      this.routeService.navigateByUrl(url, extras);
    }
  }

  public navigateByApp(appName: string, appPath: string = ''): void {
    if (this.frameIsRun && MaTypeUtil.nonEmptyString(appName)) {
      if (MaTypeUtil.nonEmptyString(appPath) && (appPath.indexOf('/') === 0)) {
        appPath = appPath.substr(1, appPath.length);
      }
      const url: string = `/${MaRouteUtil.APP_ROUTE_PATH}/${appName}/${appPath}`;
      this.dispatchAppData(MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.navigateByUrl,
        dataContent: {
          url: url,
        } as MaDataRecord,
      } as MaInfoMessage));
    }
  }

  public startFrame(): void {
    if (MaEnvironmentApi.isAppEnvironment()) {
      MaSubApi.addDataListener(this.handleAppData.bind(this), true);
      MaSubApi.addGlobalDataListener(this.handleGlobalData.bind(this), true);
      this.frameIsRun = true;
    } else {
      this.frameIsRun = false;
    }
  }

}
