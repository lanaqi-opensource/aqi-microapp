import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { unmountAppParams } from '@micro-zoe/micro-app/micro_app';

import { MaErrorHandler } from '../common/ma-error-handler';
import { MaCompleteHandler } from '../common/ma-complete-handler';
import { MaGlobalApi } from '../common/ma-global.api';
import { MaTypeUtil } from '../common/ma-type-util';

import { MaFrameConfig } from './ma-frame-config';
import { MaFrameModel } from './ma-frame-model';
import { MaLifecycleEvent } from './ma-lifecycle-event';
import { MaLifecycleHandler } from './ma-lifecycle-handler';
import { MaActivatedRoute } from './ma-activated-route';
import { MaTemplateLoader } from './ma-template-loader';

@Component({
  selector: 'ma-frame',
  templateUrl: './ma-frame.component.html',
  styleUrls: [
    './ma-frame.component.less'
  ],
})
export class MaFrameComponent implements OnInit, OnDestroy {

  @Input('appId')
  public appId: string = '';

  @Input('appSsr')
  public appSsr: boolean = false;

  @Input('appUrl')
  public appUrl: string = '';

  @Input('appName')
  public appName: string = '';

  @Input('appInline')
  public appInline: boolean = false;

  @Input('appDestroy')
  public appDestroy: boolean = false;

  @Input('keepAlive')
  public keepAlive: boolean = false;

  @Input('shadowDom')
  public shadowDom: boolean = false;

  @Input('disableSandbox')
  public disableSandbox: boolean = false;

  @Input('disableScopeCss')
  public disableScopeCss: boolean = true;

  @Input('baseRoute')
  public baseRoute: string = '';

  @Input('autoRoute')
  public autoRoute: boolean = true;

  public preFetch: boolean = false;

  @Output('createdHandler')
  private onCreatedEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('beforeMountHandler')
  private onBeforeMountEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('mountedHandler')
  private onMountedEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('unmountHandler')
  private onUnmountEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('errorHandler')
  private onErrorEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('afterHiddenHandler')
  private onAfterHiddenEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('beforeShowHandler')
  private onBeforeShowEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('afterShowHandler')
  private onAfterShowEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('beforeLoadHandler')
  private onBeforeLoadEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  @Output('afterLoadHandler')
  private onAfterLoadEmitter: EventEmitter<MaLifecycleEvent> = new EventEmitter<MaLifecycleEvent>();

  private errorComponentStatus: boolean = false;

  private errorTemplateEnable: boolean = true;

  private errorTemplateLoader?: MaTemplateLoader;

  public constructor(private ngRouter: Router, private ngActivatedRoute: ActivatedRoute) {
    this.ngActivatedRoute.data.subscribe((state: Data) => {
        const activatedRoute: MaActivatedRoute = state as MaActivatedRoute;
        if (MaTypeUtil.isSafe(activatedRoute) && MaTypeUtil.isBoolean(activatedRoute.routeMode) && activatedRoute.routeMode) {
          this.bindFrameModel(activatedRoute.frameModel);
        }
      },
      error => console.error(error),
    );
  }

  private bindFrameModel(frameModel: MaFrameModel): void {
    if (MaTypeUtil.isObject(frameModel)) {
      this.appId = frameModel?.appId ?? '';
      this.appUrl = frameModel?.appUrl ?? '';
      this.appSsr = frameModel?.appSsr ?? false;
      this.appName = frameModel?.appName ?? '';
      this.appInline = frameModel?.appInline ?? false;
      this.appDestroy = frameModel?.appDestroy ?? false;
      this.keepAlive = frameModel?.keepAlive ?? false;
      this.shadowDom = frameModel?.shadowDom ?? false;
      this.disableSandbox = frameModel?.disableSandbox ?? false;
      this.disableScopeCss = frameModel?.disableScopeCss ?? true;
      this.baseRoute = frameModel?.baseRoute ?? '';
      this.autoRoute = frameModel?.autoRoute ?? true;
      this.preFetch = frameModel?.preFetch ?? false;
      this.errorTemplateEnable = frameModel?.errorTemplateEnable ?? true;
      this.errorTemplateLoader = frameModel?.errorTemplateLoader ?? undefined;
      this.bindLifecycleHandler(this.onCreatedEmitter, frameModel?.onCreatedHandler);
      this.bindLifecycleHandler(this.onBeforeMountEmitter, frameModel?.onBeforeMountHandler);
      this.bindLifecycleHandler(this.onMountedEmitter, frameModel?.onMountedHandler);
      this.bindLifecycleHandler(this.onUnmountEmitter, frameModel?.onUnmountHandler);
      this.bindLifecycleHandler(this.onErrorEmitter, frameModel?.onErrorHandler);
      this.bindLifecycleHandler(this.onAfterHiddenEmitter, frameModel?.onAfterHiddenHandler);
      this.bindLifecycleHandler(this.onBeforeShowEmitter, frameModel?.onBeforeShowHandler);
      this.bindLifecycleHandler(this.onAfterShowEmitter, frameModel?.onAfterShowHandler);
      this.bindLifecycleHandler(this.onBeforeLoadEmitter, frameModel?.onBeforeLoadHandler);
      this.bindLifecycleHandler(this.onAfterLoadEmitter, frameModel?.onAfterLoadHandler);
    }
  }

  // noinspection JSMethodCanBeStatic
  private bindLifecycleHandler(eventEmitter: EventEmitter<MaLifecycleEvent>, lifecycleHandler?: MaLifecycleHandler): void {
    if (MaTypeUtil.isFunction(lifecycleHandler)) {
      eventEmitter.subscribe(lifecycleHandler);
    }
  }

  private buildLifecycleEvent(customEvent: CustomEvent): MaLifecycleEvent {
    return {
      customEvent: customEvent,
      frameComponent: this,
    } as MaLifecycleEvent;
  }

  public isInvalidAttributes(): boolean {
    return MaTypeUtil.isEmptyString(this.appName) || MaTypeUtil.isEmptyString(this.appUrl) || MaTypeUtil.isEmptyString(this.baseRoute);
  }

  public isEffectiveAttributes(): boolean {
    return !this.isInvalidAttributes();
  }

  public isErrorComponent(): boolean {
    return this.errorComponentStatus;
  }

  public nonErrorComponent(): boolean {
    return !this.isErrorComponent();
  }

  private openErrorComponent(): void {
    this.errorComponentStatus = true;
  }

  private closeErrorComponent(): void {
    this.errorComponentStatus = false;
  }

  public loadErrorTemplate(): TemplateRef<void> | undefined {
    if (this.errorTemplateEnable && MaTypeUtil.isFunction(this.errorTemplateLoader)) {
      // @ts-ignore
      return this.errorTemplateLoader(this);
    }
    return undefined;
  }

  public handleCreated(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onBeforeLoadEmitter.emit(lifecycleEven);
    this.onCreatedEmitter.emit(lifecycleEven);
  }

  public subscribeCreated(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onCreatedEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleBeforeMount(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.closeErrorComponent();
    this.onBeforeMountEmitter.emit(lifecycleEven);
  }

  public subscribeBeforeMount(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeMountEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleMounted(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onAfterLoadEmitter.emit(lifecycleEven);
    this.onMountedEmitter.emit(lifecycleEven);
  }

  public subscribeMounted(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onMountedEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleUnmount(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onUnmountEmitter.emit(lifecycleEven);
  }

  public subscribeUnmount(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onUnmountEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleError(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.openErrorComponent();
    this.onAfterLoadEmitter.emit(lifecycleEven);
    this.onErrorEmitter.emit(lifecycleEven);
  }

  public subscribeError(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onErrorEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleAfterHidden(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onAfterHiddenEmitter.emit(lifecycleEven);
  }

  public subscribeAfterHidden(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterHiddenEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleBeforeShow(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onAfterLoadEmitter.emit(lifecycleEven);
    this.onBeforeShowEmitter.emit(lifecycleEven);
  }

  public subscribeBeforeShow(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeShowEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public handleAfterShow(customEvent: any): void {
    const lifecycleEven: MaLifecycleEvent = this.buildLifecycleEvent(customEvent);
    this.onAfterShowEmitter.emit(lifecycleEven);
  }

  public subscribeAfterShow(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterShowEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public subscribeBeforeLoad(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeLoadEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  public subscribeAfterLoad(lifecycleHandler: MaLifecycleHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterLoadEmitter.subscribe(lifecycleHandler, errorHandler, completeHandler);
  }

  private buildAutoRoute(): void {
    if (this.autoRoute && MaTypeUtil.isEmptyString(this.baseRoute)) {
      const routeUrl: string = this.ngRouter.url;
      const routeFind: boolean = routeUrl.indexOf('/') === 0;
      const routeSegments: string[] = routeUrl.split('/');
      let autoRoute: string = routeUrl;
      if (routeSegments.length > 2 && routeFind) {
        autoRoute = `/${routeSegments[1]}/${routeSegments[2]}`;
      } else if (routeSegments.length === 2 && !routeFind) {
        autoRoute = `/${routeSegments[0]}/${routeSegments[1]}`;
      }
      const paramIndex: number = autoRoute.indexOf('?');
      if (paramIndex != -1) {
        autoRoute = autoRoute.substr(0, paramIndex);
      }
      if (autoRoute.lastIndexOf('/') != autoRoute.length) {
        autoRoute = `${autoRoute}/`;
      }
      this.baseRoute = autoRoute;
    }
  }

  public ngOnInit(): void {
    this.buildAutoRoute();
  }

  public ngOnDestroy(): void {
    this.onCreatedEmitter.unsubscribe();
    this.onBeforeMountEmitter.unsubscribe();
    this.onMountedEmitter.unsubscribe();
    this.onUnmountEmitter.unsubscribe();
    this.onErrorEmitter.unsubscribe();
    this.onAfterHiddenEmitter.unsubscribe();
    this.onBeforeShowEmitter.unsubscribe();
    this.onAfterShowEmitter.unsubscribe();
    this.onBeforeLoadEmitter.unsubscribe();
    this.onAfterLoadEmitter.unsubscribe();
    if (this.isErrorComponent()) {
      // noinspection JSIgnoredPromiseFromCall
      MaGlobalApi.unmountApp(this.appName, {
        destroy: true,
        clearAliveState: true,
      } as unmountAppParams);
    } else {
      // noinspection JSIgnoredPromiseFromCall
      MaGlobalApi.unmountApp(this.appName, {
        destroy: this.appDestroy,
        clearAliveState: !this.keepAlive,
      } as unmountAppParams);
    }
  }

  public toFrameConfig(): MaFrameConfig {
    return {
      appId: this.appId,
      appSsr: this.appSsr,
      appUrl: this.appUrl,
      appName: this.appName,
      appInline: this.appInline,
      appDestroy: this.appDestroy,
      keepAlive: this.keepAlive,
      shadowDom: this.shadowDom,
      disableSandbox: this.disableSandbox,
      disableScopeCss: this.disableScopeCss,
      baseRoute: this.baseRoute,
      autoRoute: this.autoRoute,
      preFetch: this.preFetch,
    } as MaFrameConfig;
  }

}
