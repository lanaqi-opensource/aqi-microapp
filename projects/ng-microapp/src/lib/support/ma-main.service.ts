import { EventEmitter, Injectable, TemplateRef } from '@angular/core';
import { NavigationBehaviorOptions, NavigationExtras, UrlTree } from '@angular/router';

import { globalAssetsType, lifeCyclesType, OptionsType, plugins, prefetchParam, sourceScriptInfo } from '@micro-app/types';

import { MaMainApi } from '../common/ma-main.api';
import { MaEnvironmentApi } from '../common/ma-environment.api';
import { MaTypeUtil } from '../common/ma-type-util';

import { MaErrorHandler } from '../context/ma-error-handler';
import { MaCompleteHandler } from '../context/ma-complete-handler';
import { MaFrameEvent } from '../context/ma-frame-event';
import { MaFrameConfig } from '../context/ma-frame-config';
import { MaFrameDefine } from '../context/ma-frame-define';
import { MaFrameModel } from '../context/ma-frame-model';
import { MaFrameHandler } from '../context/ma-frame-handler';
import { MaRouteService } from '../context/ma-route.service';
import { MaFrameUtil } from '../context/ma-frame-util';
import { MaRouteUtil } from '../context/ma-route-util';

import { MaDataRecord } from '../dataset/ma-data-record';
import { MaDataHandler } from '../dataset/ma-data-handler';
import { MaDataStruct } from '../dataset/ma-data-struct';
import { MaDataPackage } from '../dataset/ma-data-package';
import { MaDataUtil } from '../dataset/ma-data-util';

import { MaInfoStruct } from '../inside/ma-info-struct';
import { MaInfoHeader } from '../inside/ma-info-header';
import { MaInfoPackage } from '../inside/ma-info-package';

import { MaFetchType } from './ma-fetch-type';
import { MaGlobalEvent } from './ma-global-event';
import { MaGlobalHandler } from './ma-global-handler';
import { MaMainUtil } from './ma-main-util';

@Injectable({
  providedIn: 'root',
})
export class MaMainService {

  private jsAssets: string[] = [];

  private cssAssets: string[] = [];

  private frameConfigs: MaFrameConfig[] = [];

  private isFrameStart: boolean = false;

  private cacheAppData: Map<string, MaDataRecord> = new Map<string, MaDataRecord>();

  private cacheGlobalData: MaDataRecord = {};

  private frameCreatedEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameBeforeMountEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameMountedEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameUnmountEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameErrorEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameAfterHiddenEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameBeforeShowEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameAfterShowEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameBeforeLoadEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private frameAfterLoadEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private globalCreatedEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalBeforeMountEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalMountedEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalUnmountEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalErrorEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private appDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  private globalDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  public constructor(private routeService: MaRouteService) {
  }

  public sendAppData(appName: string, externalData: MaDataRecord): void {
    if (this.isFrameStart) {
      this.cacheAppData.set(appName, externalData);
      MaMainUtil.setAppExternal(appName, externalData);
    }
  }

  public gainAppData(appName: string, fromBase?: boolean): MaDataRecord {
    if (this.isFrameStart) {
      return MaMainUtil.getAppExternal(appName, fromBase);
    }
    return {} as MaDataRecord;
  }

  public cleanAppData(appName: string): void {
    this.sendAppData(appName, {} as MaDataRecord);
  }

  public changeAppData(appName: string, externalData: MaDataRecord): void {
    this.sendAppData(appName, MaDataUtil.mergeDataRecord(this.cacheAppData.get(appName), externalData));
  }

  public sendGlobalData(externalData: MaDataRecord): void {
    if (this.isFrameStart) {
      this.cacheGlobalData = externalData;
      MaMainUtil.setGlobalExternal(externalData);
    }
  }

  public gainGlobalData(): MaDataRecord {
    if (this.isFrameStart) {
      return MaMainUtil.getGlobalExternal();
    }
    return {} as MaDataRecord;
  }

  public cleanGlobalData(): void {
    this.sendGlobalData({} as MaDataRecord);
  }

  public changeGlobalData(externalData: MaDataRecord): void {
    this.sendGlobalData(MaDataUtil.mergeDataRecord(this.cacheGlobalData, externalData));
  }

  private dispatchAppData(appName: string, infoPackage: MaInfoPackage): void {
    MaMainUtil.setAppInternal(appName, infoPackage, this.cacheAppData.get(appName));
  }

  private acceptAppData(infoPackage: MaInfoPackage): void {
    const dataHeader: MaInfoHeader = infoPackage.getHeader();
    const dataContent: MaDataRecord = infoPackage.getContent();
    switch (dataHeader) {
      case MaInfoHeader.navigateByCommands:
        this.navigateByCommands((dataContent as any).commands, (dataContent as any).extras);
        break;
      case MaInfoHeader.navigateByUrl:
        this.navigateByUrl((dataContent as any).url, (dataContent as any).extras);
        break;
      case MaInfoHeader.unknown:
      default:
        this.defaultAppData(dataContent);
        break;
    }
  }

  private dispatchGlobalData(infoPackage: MaInfoPackage): void {
    MaMainUtil.setGlobalInternal(infoPackage, this.cacheGlobalData);
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

  private defaultAppData(dataContent: MaDataRecord): void {
  }

  private defaultGlobalData(dataContent: MaDataRecord): void {
  }

  public navigateByCommands(commands: any[], extras?: NavigationExtras): void {
    this.routeService.navigateByCommands(commands, extras);
  }

  public navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
    this.routeService.navigateByUrl(url, extras);
  }

  public navigateByApp(appName: string, appPath: string = ''): void {
    if (this.isFrameStart && MaTypeUtil.nonEmptyString(appName)) {
      if (MaTypeUtil.nonEmptyString(appPath) && (appPath.indexOf('/') === 0)) {
        appPath = appPath.substr(1, appPath.length);
      }
      const url: string = `/${MaRouteUtil.MATCH_APP_ROUTE}/${appName}/${appPath}`;
      this.navigateByUrl(url);
    }
  }

  private handleAppData(dataRecord: MaDataRecord): void {
    const dataPackage: MaDataPackage = MaDataPackage.buildPackage(dataRecord as MaDataStruct);
    if (dataPackage.isInternal()) {
      this.acceptAppData(MaInfoPackage.buildPackage(dataPackage.getInternal() as MaInfoStruct));
    } else {
      this.appDataEmitter.emit(dataPackage.getExternal());
    }
  }

  public subscribeAppData(dataHandler: MaDataHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.appDataEmitter.subscribe(dataHandler, errorHandler, completeHandler);
  }

  private handleGlobalData(dataRecord: MaDataRecord): void {
    const dataPackage: MaDataPackage = MaDataPackage.buildPackage(dataRecord as MaDataStruct);
    if (dataPackage.isInternal()) {
      this.acceptGlobalData(MaInfoPackage.buildPackage(dataPackage.getInternal() as MaInfoStruct));
    } else {
      this.globalDataEmitter.emit(dataPackage.getExternal());
    }
  }

  public subscribeGlobalData(dataHandler: MaDataHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalDataEmitter.subscribe(dataHandler, errorHandler, completeHandler);
  }

  private handleFrameCreated(frameEvent: MaFrameEvent): void {
    this.frameCreatedEmitter.emit(frameEvent);
  }

  public subscribeFrameCreated(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameCreatedEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeMount(frameEvent: MaFrameEvent): void {
    this.frameBeforeMountEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeMount(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeMountEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameMounted(frameEvent: MaFrameEvent): void {
    this.frameMountedEmitter.emit(frameEvent);
  }

  public subscribeFrameMounted(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameMountedEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameUnmount(frameEvent: MaFrameEvent): void {
    this.frameUnmountEmitter.emit(frameEvent);
  }

  public subscribeFrameUnmount(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameUnmountEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameError(frameEvent: MaFrameEvent): void {
    this.frameErrorEmitter.emit(frameEvent);
  }

  public subscribeFrameError(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameErrorEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterHidden(frameEvent: MaFrameEvent): void {
    this.dispatchAppData(
      frameEvent.frameComponent.appName,
      MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.keepAliveAfterHidden,
        dataContent: {
          appName: frameEvent.frameComponent.appName,
        } as MaDataRecord,
      } as MaInfoStruct)
    );
    this.frameAfterHiddenEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterHidden(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterHiddenEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeShow(frameEvent: MaFrameEvent): void {
    this.dispatchAppData(
      frameEvent.frameComponent.appName,
      MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.keepAliveBeforeShow,
        dataContent: {
          appName: frameEvent.frameComponent.appName,
        } as MaDataRecord,
      } as MaInfoStruct)
    );
    this.frameBeforeShowEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeShow(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeShowEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterShow(frameEvent: MaFrameEvent): void {
    this.frameAfterShowEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterShow(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterShowEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeLoad(frameEvent: MaFrameEvent): void {
    this.frameBeforeLoadEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeLoad(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeLoadEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterLoad(frameEvent: MaFrameEvent): void {
    this.frameAfterLoadEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterLoad(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterLoadEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  private buildGlobalEvent(customEvent: CustomEvent): MaGlobalEvent {
    return {
      customEvent: customEvent,
      frameConfigs: this.frameConfigs,
    } as MaGlobalEvent;
  }

  private handleGlobalCreated(customEvent: CustomEvent): void {
    this.globalCreatedEmitter.emit(this.buildGlobalEvent(customEvent));
  }

  public subscribeGlobalCreated(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalCreatedEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalBeforeMount(customEvent: CustomEvent): void {
    this.globalBeforeMountEmitter.emit(this.buildGlobalEvent(customEvent));
  }

  public subscribeGlobalBeforeMount(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalBeforeMountEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalMounted(customEvent: CustomEvent): void {
    this.globalMountedEmitter.emit(this.buildGlobalEvent(customEvent));
  }

  public subscribeGlobalMounted(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalMountedEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalUnmount(customEvent: CustomEvent): void {
    this.globalUnmountEmitter.emit(this.buildGlobalEvent(customEvent));
  }

  public subscribeGlobalUnmount(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalUnmountEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalError(customEvent: CustomEvent): void {
    this.globalErrorEmitter.emit(this.buildGlobalEvent(customEvent));
  }

  public subscribeGlobalError(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalErrorEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private buildFrameDefine(errorTemplate?: TemplateRef<void>, errorSupported?: boolean): MaFrameDefine {
    return {
      errorTemplate: errorTemplate,
      errorSupported: errorSupported,
      onCreatedHandler: this.handleFrameCreated.bind(this),
      onBeforeMountHandler: this.handleFrameBeforeMount.bind(this),
      onMountedHandler: this.handleFrameMounted.bind(this),
      onUnmountHandler: this.handleFrameUnmount.bind(this),
      onErrorHandler: this.handleFrameError.bind(this),
      onAfterHiddenHandler: this.handleFrameAfterHidden.bind(this),
      onBeforeShowHandler: this.handleFrameBeforeShow.bind(this),
      onAfterShowHandler: this.handleFrameAfterShow.bind(this),
      onBeforeLoadHandler: this.handleFrameBeforeLoad.bind(this),
      onAfterLoadHandler: this.handleFrameAfterLoad.bind(this),
    } as MaFrameDefine;
  }

  private buildFrameModels(frameConfigs: MaFrameConfig[], errorTemplate?: TemplateRef<void>, errorSupported?: boolean): MaFrameModel[] {
    return MaFrameUtil.buildFrameModels(frameConfigs, this.buildFrameDefine(errorTemplate, errorSupported));
  }

  private buildFrameRoutes(emptyRoute: boolean = true, errorTemplate?: TemplateRef<void>, errorSupported?: boolean): void {
    if (MaTypeUtil.nonEmptyArray(this.frameConfigs)) {
      const frameModels: MaFrameModel[] = this.buildFrameModels(this.frameConfigs, errorTemplate, errorSupported);
      this.routeService.appendRoutes(MaRouteUtil.buildModelRoutes(frameModels, emptyRoute));
    }
  }

  private getFrameConfig(appName: string): MaFrameConfig | null {
    if (MaTypeUtil.nonEmptyString(appName) && MaTypeUtil.nonEmptyArray(this.frameConfigs)) {
      for (const frameConfig of this.frameConfigs) {
        if (MaTypeUtil.nonEmptyString(frameConfig?.appName) && appName === frameConfig?.appName) {
          return frameConfig;
        }
      }
    }
    return null;
  }

  private isExistConfig(appName: string): boolean {
    return MaTypeUtil.isSafe(this.getFrameConfig(appName));
  }

  private nonExistConfig(appName: string): boolean {
    return !this.isExistConfig(appName);
  }

  public registerFrames(frameConfigs: MaFrameConfig[], emptyRoute: boolean = true, errorTemplate?: TemplateRef<void>, errorSupported?: boolean): void {
    if (MaTypeUtil.nonEmptyArray(frameConfigs)) {
      frameConfigs.forEach(frameConfig => {
        const appName: string | undefined = frameConfig?.appName;
        if (MaTypeUtil.nonEmptyString(appName) && this.nonExistConfig(appName as string)) {
          MaMainApi.addDataListener(appName as string, this.handleAppData.bind(this), true);
          this.frameConfigs.push(frameConfig);
        }
      });
      this.buildFrameRoutes(emptyRoute, errorTemplate, errorSupported);
    }
  }

  public registerJs(jsAssets: string[]): void {
    if (MaTypeUtil.nonEmptyArray(jsAssets)) {
      jsAssets.forEach(jsAsset => {
        this.jsAssets.push(jsAsset);
      });
    }
  }

  public registerCss(cssAssets: string[]): void {
    if (MaTypeUtil.nonEmptyArray(cssAssets)) {
      cssAssets.forEach(cssAsset => {
        this.cssAssets.push(cssAsset);
      });
    }
  }

  private buildOptionsType(loadPlugins?: plugins, fetchType?: MaFetchType): OptionsType {
    // noinspection SpellCheckingInspection
    return {
      // tagName: '',
      shadowDOM: false,
      destroy: false,
      inline: false,
      disableScopecss: true,
      disableSandbox: false,
      ssr: false,
      lifeCycles: this.buildLifeCycles(),
      preFetchApps: this.buildPreFetchs(),
      plugins: MaTypeUtil.isFunction(loadPlugins) ? loadPlugins : this.buildLoadPlugins.bind(this),
      fetch: MaTypeUtil.isFunction(fetchType) ? fetchType : this.buildFetchType.bind(this),
      globalAssets: this.buildGlobalAssets(),
    } as OptionsType;
  }

  private buildLifeCycles(): lifeCyclesType {
    // noinspection SpellCheckingInspection
    return {
      created: this.handleGlobalCreated.bind(this),
      beforemount: this.handleGlobalBeforeMount.bind(this),
      mounted: this.handleGlobalMounted.bind(this),
      unmount: this.handleGlobalUnmount.bind(this),
      error: this.handleGlobalError.bind(this),
    } as lifeCyclesType;
  }

  // noinspection JSMethodCanBeStatic
  private buildPreFetch(frameConfig: MaFrameConfig): prefetchParam {
    // noinspection SpellCheckingInspection
    return {
      name: frameConfig?.appName ?? '',
      url: frameConfig?.appUrl ?? '',
      disableScopecss: frameConfig?.disableScopeCss ?? true,
      disableSandbox: frameConfig?.disableSandbox ?? false,
      shadowDOM: frameConfig?.shadowDom ?? false,
    } as prefetchParam;
  }

  // noinspection SpellCheckingInspection
  private buildPreFetchs(): prefetchParam[] {
    const preParams: prefetchParam[] = [];
    if (MaTypeUtil.nonEmptyArray(this.frameConfigs)) {
      this.frameConfigs.forEach(frameConfig => {
        if (MaTypeUtil.isBoolean(frameConfig.preFetch) && frameConfig.preFetch) {
          preParams.push(this.buildPreFetch(frameConfig));
        }
      });
    }
    return preParams;
  }

  // noinspection JSMethodCanBeStatic
  private buildLoadPlugins(): plugins {
    return {
      global: [
        {
          loader: (code: string, url: string, options: unknown, info: sourceScriptInfo): string => {
            if (url.indexOf('.js') != -1) {
              return code.replace('//# sourceMappingURL=', `//# sourceMappingURL=${new URL(url).origin}/`);
            }
            return code;
          }
        },
      ],
    } as plugins;
  }

  // noinspection JSMethodCanBeStatic
  private buildFetchType(url: string, options: MaDataRecord, appName: string | null): Promise<string> {
    return fetch(url, {
      ...options,
      mode: 'cors',
      method: 'get',
      credentials: 'same-origin',
    }).then((res) => {
      return res.text().then(content => {
        if (url.indexOf('.css') != -1) {
          content = content.replace('/*# sourceMappingURL=', `/*# sourceMappingURL=${new URL(url).origin}/`);
        }
        return content;
      });
    });
  }

  // noinspection JSMethodCanBeStatic
  private buildGlobalAssets(): globalAssetsType {
    return {
      js: this.jsAssets,
      css: this.cssAssets,
    } as globalAssetsType;
  }

  public startFrames(loadPlugins?: plugins, fetchType?: MaFetchType): void {
    MaMainApi.addGlobalDataListener(this.handleGlobalData.bind(this), true);
    MaMainApi.start(this.buildOptionsType(loadPlugins, fetchType));
    this.isFrameStart = MaEnvironmentApi.isAppBaseApplication();
  }

  public getAppNames(): string[] {
    const appNames: string[] = [];
    if (MaTypeUtil.nonEmptyArray(this.frameConfigs)) {
      this.frameConfigs.forEach(frameConfig => {
        appNames.push(frameConfig?.appName as string);
      });
    }
    return appNames;
  }

}
