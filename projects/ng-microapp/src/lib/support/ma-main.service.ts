import { EventEmitter, Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationExtras, UrlTree } from '@angular/router';

import { globalAssetsType, lifeCyclesType, OptionsType, plugins, prefetchParam, sourceScriptInfo } from '@micro-app/types';

import { MaErrorHandler } from '../common/ma-error-handler';
import { MaCompleteHandler } from '../common/ma-complete-handler';
import { MaMainApi } from '../common/ma-main.api';
import { MaEnvironmentApi } from '../common/ma-environment.api';
import { MaTypeUtil } from '../common/ma-type-util';

import { MaLifecycleEvent } from '../context/ma-lifecycle-event';
import { MaFrameConfig } from '../context/ma-frame-config';
import { MaFrameDefine } from '../context/ma-frame-define';
import { MaFrameModel } from '../context/ma-frame-model';
import { MaLifecycleHandler } from '../context/ma-lifecycle-handler';
import { MaTemplateLoader } from '../context/ma-template-loader';
import { MaModelUtil } from '../context/ma-model-util';
import { MaRouteUtil } from '../context/ma-route-util';

import { MaDataRecord } from '../dataset/ma-data-record';
import { MaDataHandler } from '../dataset/ma-data-handler';
import { MaDataStruct } from '../dataset/ma-data-struct';
import { MaDataPackage } from '../dataset/ma-data-package';
import { MaDataUtil } from '../dataset/ma-data-util';

import { MaInfoMessage } from '../inside/ma-info-message';
import { MaInfoHeader } from '../inside/ma-info-header';
import { MaInfoPackage } from '../inside/ma-info-package';

import { MaFetchType } from './ma-fetch-type';
import { MaGlobalEvent } from './ma-global-event';
import { MaGlobalHandler } from './ma-global-handler';
import { MaMainUtil } from './ma-main-util';
import { MaRouteService } from './ma-route.service';

@Injectable({
  providedIn: 'root',
})
export class MaMainService {

  private frameIsRun: boolean = false;

  private frameTemplateLoader?: MaTemplateLoader;

  private jsAssetSet: Set<string> = new Set<string>();

  private cssAssetSet: Set<string> = new Set<string>();

  private frameConfigMap: Map<string, MaFrameConfig> = new Map<string, MaFrameConfig>();

  private cacheAppDataMap: Map<string, MaDataRecord> = new Map<string, MaDataRecord>();

  private cacheGlobalData: MaDataRecord = {};

  private frameCreatedEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameBeforeMountEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameMountedEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameUnmountEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameErrorEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameAfterHiddenEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameBeforeShowEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameAfterShowEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameBeforeLoadEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private frameAfterLoadEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private globalCreatedEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalBeforeMountEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalMountedEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalUnmountEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private globalErrorEmitter: EventEmitter<MaGlobalEvent> = new EventEmitter<MaGlobalEvent>();

  private appDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  private globalDataEmitter: EventEmitter<MaDataRecord> = new EventEmitter<MaDataRecord>();

  public constructor(private routeService: MaRouteService) {
  }

  public errorTemplateLoader(errorTemplateLoader?: MaTemplateLoader): void {
    if (MaTypeUtil.isFunction(errorTemplateLoader)) {
      this.frameTemplateLoader = errorTemplateLoader;
    }
  }

  public navigateByCommands(commands: any[], extras?: NavigationExtras): void {
    this.routeService.navigateByCommands(commands, extras);
  }

  public navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
    this.routeService.navigateByUrl(url, extras);
  }

  public navigateByApp(appName: string, appPath: string = ''): void {
    if (this.frameIsRun && MaTypeUtil.nonEmptyString(appName)) {
      if (MaTypeUtil.nonEmptyString(appPath) && (appPath.indexOf('/') === 0)) {
        appPath = appPath.substr(1, appPath.length);
      }
      const url: string = `/${MaRouteUtil.APP_ROUTE_PATH}/${appName}/${appPath}`;
      this.navigateByUrl(url);
    }
  }

  public sendAppData(appName: string, externalData: MaDataRecord): void {
    if (this.frameIsRun) {
      this.cacheAppDataMap.set(appName, externalData);
      MaMainUtil.setAppExternal(appName, externalData);
    }
  }

  public gainAppData(appName: string, fromBase?: boolean): MaDataRecord {
    if (this.frameIsRun) {
      return MaMainUtil.getAppExternal(appName, fromBase);
    }
    return {} as MaDataRecord;
  }

  public cleanAppData(appName: string): void {
    this.sendAppData(appName, {} as MaDataRecord);
  }

  public changeAppData(appName: string, externalData: MaDataRecord): void {
    this.sendAppData(appName, MaDataUtil.mergeDataRecord(this.cacheAppDataMap.get(appName), externalData));
  }

  private dispatchAppData(appName: string, infoPackage: MaInfoPackage): void {
    MaMainUtil.setAppInternal(appName, infoPackage, this.cacheAppDataMap.get(appName));
  }

  private defaultAppData(dataContent: MaDataRecord): void {
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
      MaMainUtil.setGlobalExternal(externalData);
    }
  }

  public gainGlobalData(): MaDataRecord {
    if (this.frameIsRun) {
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

  private dispatchGlobalData(infoPackage: MaInfoPackage): void {
    MaMainUtil.setGlobalInternal(infoPackage, this.cacheGlobalData);
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

  private handleFrameCreated(frameEvent: MaLifecycleEvent): void {
    this.frameCreatedEmitter.emit(frameEvent);
  }

  public subscribeFrameCreated(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameCreatedEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeMount(frameEvent: MaLifecycleEvent): void {
    this.frameBeforeMountEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeMount(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeMountEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameMounted(frameEvent: MaLifecycleEvent): void {
    this.frameMountedEmitter.emit(frameEvent);
  }

  public subscribeFrameMounted(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameMountedEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameUnmount(frameEvent: MaLifecycleEvent): void {
    this.frameUnmountEmitter.emit(frameEvent);
  }

  public subscribeFrameUnmount(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameUnmountEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameError(frameEvent: MaLifecycleEvent): void {
    this.frameErrorEmitter.emit(frameEvent);
  }

  public subscribeFrameError(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameErrorEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterHidden(frameEvent: MaLifecycleEvent): void {
    this.dispatchAppData(
      frameEvent.frameComponent.appName,
      MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.keepAliveAfterHidden,
        dataContent: {
          appName: frameEvent.frameComponent.appName,
        } as MaDataRecord,
      } as MaInfoMessage)
    );
    this.frameAfterHiddenEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterHidden(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterHiddenEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeShow(frameEvent: MaLifecycleEvent): void {
    this.dispatchAppData(
      frameEvent.frameComponent.appName,
      MaInfoPackage.buildPackage({
        dataHeader: MaInfoHeader.keepAliveBeforeShow,
        dataContent: {
          appName: frameEvent.frameComponent.appName,
        } as MaDataRecord,
      } as MaInfoMessage)
    );
    this.frameBeforeShowEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeShow(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeShowEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterShow(frameEvent: MaLifecycleEvent): void {
    this.frameAfterShowEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterShow(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterShowEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameBeforeLoad(frameEvent: MaLifecycleEvent): void {
    this.frameBeforeLoadEmitter.emit(frameEvent);
  }

  public subscribeFrameBeforeLoad(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameBeforeLoadEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private handleFrameAfterLoad(frameEvent: MaLifecycleEvent): void {
    this.frameAfterLoadEmitter.emit(frameEvent);
  }

  public subscribeFrameAfterLoad(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.frameAfterLoadEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private buildGlobalEvent(customEvent: CustomEvent): MaGlobalEvent {
    return {
      customEvent: customEvent,
      frameConfigs: this.toFrameConfigs(),
    } as MaGlobalEvent;
  }

  private handleGlobalCreated(customEvent: CustomEvent): void {
    const globalEvent: MaGlobalEvent = this.buildGlobalEvent(customEvent);
    this.globalCreatedEmitter.emit(globalEvent);
  }

  public subscribeGlobalCreated(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalCreatedEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalBeforeMount(customEvent: CustomEvent): void {
    const globalEvent: MaGlobalEvent = this.buildGlobalEvent(customEvent);
    this.globalBeforeMountEmitter.emit(globalEvent);
  }

  public subscribeGlobalBeforeMount(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalBeforeMountEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalMounted(customEvent: CustomEvent): void {
    const globalEvent: MaGlobalEvent = this.buildGlobalEvent(customEvent);
    this.globalMountedEmitter.emit(globalEvent);
  }

  public subscribeGlobalMounted(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalMountedEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalUnmount(customEvent: CustomEvent): void {
    const globalEvent: MaGlobalEvent = this.buildGlobalEvent(customEvent);
    this.globalUnmountEmitter.emit(globalEvent);
  }

  public subscribeGlobalUnmount(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalUnmountEmitter.subscribe(globalHandler, errorHandler, completeHandler);
  }

  private handleGlobalError(customEvent: CustomEvent): void {
    const globalEvent: MaGlobalEvent = this.buildGlobalEvent(customEvent);
    this.globalErrorEmitter.emit(globalEvent);
  }

  public subscribeGlobalError(globalHandler: MaGlobalHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.globalErrorEmitter.subscribe(globalHandler, errorHandler, completeHandler);
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
    this.frameConfigMap.forEach((frameConfig, appName) => {
      if (MaTypeUtil.isBoolean(frameConfig?.preFetch) && frameConfig?.preFetch) {
        preParams.push(this.buildPreFetch(frameConfig));
      }
    });
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
      js: this.toJsAssets(),
      css: this.toCssAssets(),
    } as globalAssetsType;
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

  private buildFrameDefine(): MaFrameDefine {
    return {
      errorTemplateEnable: true,
      errorTemplateLoader: this.frameTemplateLoader,
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

  private buildFrameModels(frameConfigs: MaFrameConfig[]): MaFrameModel[] {
    return MaModelUtil.buildFrameModels(frameConfigs, this.buildFrameDefine());
  }

  private attachFrameRoutes(): void {
    const frameConfigs: MaFrameConfig[] = this.toFrameConfigs();
    if (MaTypeUtil.nonEmptyArray(frameConfigs)) {
      const frameModels: MaFrameModel[] = this.buildFrameModels(frameConfigs);
      for (const frameModel of frameModels) {
        MaMainApi.addDataListener(frameModel.appName as string, this.handleAppData.bind(this), true);
      }
      this.routeService.resetRoutes(MaRouteUtil.buildRootRoutes(frameModels));
    }
  }

  public startFrames(loadPlugins?: plugins, fetchType?: MaFetchType): void {
    MaMainApi.addGlobalDataListener(this.handleGlobalData.bind(this), true);
    MaMainApi.start(this.buildOptionsType(loadPlugins, fetchType));
    this.attachFrameRoutes();
    this.frameIsRun = MaEnvironmentApi.isAppBaseApplication();
  }

  public launchFrames(frameConfigs: MaFrameConfig[], errorTemplateLoader?: MaTemplateLoader, loadPlugins?: plugins, fetchType?: MaFetchType): void {
    this.registerFrames(frameConfigs);
    this.errorTemplateLoader(errorTemplateLoader);
    this.startFrames(loadPlugins, fetchType);
  }

  public isExistConfig(appName: string): boolean {
    return this.frameConfigMap.has(appName);
  }

  public nonExistConfig(appName: string): boolean {
    return !this.isExistConfig(appName);
  }

  public registerFrame(frameConfig: MaFrameConfig): void {
    const appName: string | undefined = frameConfig?.appName;
    if (MaTypeUtil.nonEmptyString(appName) && this.nonExistConfig(appName as string)) {
      this.frameConfigMap.set(appName as string, frameConfig);
    }
  }

  public registerFrames(frameConfigs: MaFrameConfig[]): void {
    if (MaTypeUtil.nonEmptyArray(frameConfigs)) {
      frameConfigs.forEach(frameConfig => {
        this.registerFrame(frameConfig);
      });
    }
  }

  public registerJS(jsAsset: string): void {
    this.jsAssetSet.add(jsAsset);
  }

  public registerJs(jsAssets: string[]): void {
    if (MaTypeUtil.nonEmptyArray(jsAssets)) {
      jsAssets.forEach(jsAsset => {
        this.registerJS(jsAsset);
      });
    }
  }

  public registerCSS(cssAsset: string): void {
    this.cssAssetSet.add(cssAsset);
  }

  public registerCss(cssAssets: string[]): void {
    if (MaTypeUtil.nonEmptyArray(cssAssets)) {
      cssAssets.forEach(cssAsset => {
        this.registerCSS(cssAsset);
      });
    }
  }

  public toJsAssets(): string[] {
    const jsAssets: string[] = [];
    this.jsAssetSet.forEach((jsAsset) => {
      jsAssets.push(jsAsset);
    });
    return jsAssets;
  }

  public toCssAssets(): string[] {
    const cssAssets: string[] = [];
    this.cssAssetSet.forEach((cssAsset) => {
      cssAssets.push(cssAsset);
    });
    return cssAssets;
  }

  public toFrameConfigs(): MaFrameConfig[] {
    const frameConfigs: MaFrameConfig[] = [];
    this.frameConfigMap.forEach((frameConfig, appName) => {
      frameConfigs.push(frameConfig);
    });
    return frameConfigs;
  }

  public getAppNames(): string[] {
    const appNames: string[] = [];
    this.frameConfigMap.forEach((frameConfig, appName) => {
      appNames.push(appName);
    });
    return appNames;
  }

}
