import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { unmountAppParams } from '@micro-zoe/micro-app/micro_app';

import { MaGlobalApi } from '../common/ma-global.api';
import { MaTypeUtil } from '../common/ma-type-util';

import { MaErrorHandler } from './ma-error-handler';
import { MaCompleteHandler } from './ma-complete-handler';
import { MaFrameRoute } from './ma-frame-route';
import { MaFrameConfig } from './ma-frame-config';
import { MaFrameModel } from './ma-frame-model';
import { MaFrameEvent } from './ma-frame-event';
import { MaFrameHandler } from './ma-frame-handler';

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

  @Input('baseRoute')
  public baseRoute: string = '';

  @Input('autoRoute')
  public autoRoute: boolean = true;

  @Input('keepAlive')
  public keepAlive: boolean = false;

  @Input('shadowDom')
  public shadowDom: boolean = false;

  @Input('disableSandbox')
  public disableSandbox: boolean = false;

  @Input('disableScopeCss')
  public disableScopeCss: boolean = true;

  private preFetch: boolean = false;

  @Input('errorTemplate')
  public errorTemplate?: TemplateRef<void>;

  @Input('errorSupported')
  public errorSupported: boolean = true;

  @Output('createdHandler')
  private onCreatedEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('beforeMountHandler')
  private onBeforeMountEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('mountedHandler')
  private onMountedEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('unmountHandler')
  private onUnmountEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('errorHandler')
  private onErrorEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('afterHiddenHandler')
  private onAfterHiddenEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('beforeShowHandler')
  private onBeforeShowEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('afterShowHandler')
  private onAfterShowEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('beforeLoadHandler')
  private onBeforeLoadEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  @Output('afterLoadHandler')
  private onAfterLoadEmitter: EventEmitter<MaFrameEvent> = new EventEmitter<MaFrameEvent>();

  private errorComponent: boolean = false;

  public constructor(private ngRouter: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe((state: Data) => {
        const frameRoute: MaFrameRoute = state as MaFrameRoute;
        if (MaTypeUtil.isSafe(frameRoute) && MaTypeUtil.isBoolean(frameRoute.routeMode) && frameRoute.routeMode) {
          this.bindFrameModel(frameRoute.frameModel);
          this.buildAutoRoute();
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
      this.baseRoute = frameModel?.baseRoute ?? '';
      this.autoRoute = frameModel?.autoRoute ?? true;
      this.keepAlive = frameModel?.keepAlive ?? false;
      this.shadowDom = frameModel?.shadowDom ?? false;
      this.disableSandbox = frameModel?.disableSandbox ?? false;
      this.disableScopeCss = frameModel?.disableScopeCss ?? true;
      this.preFetch = frameModel?.preFetch ?? false;
      this.errorSupported = frameModel?.errorSupported ?? true;
      this.errorTemplate = frameModel?.errorTemplate ?? undefined;
      this.bindEventHandler(this.onCreatedEmitter, frameModel?.onCreatedHandler);
      this.bindEventHandler(this.onBeforeMountEmitter, frameModel?.onBeforeMountHandler);
      this.bindEventHandler(this.onMountedEmitter, frameModel?.onMountedHandler);
      this.bindEventHandler(this.onUnmountEmitter, frameModel?.onUnmountHandler);
      this.bindEventHandler(this.onErrorEmitter, frameModel?.onErrorHandler);
      this.bindEventHandler(this.onAfterHiddenEmitter, frameModel?.onAfterHiddenHandler);
      this.bindEventHandler(this.onBeforeShowEmitter, frameModel?.onBeforeShowHandler);
      this.bindEventHandler(this.onAfterShowEmitter, frameModel?.onAfterShowHandler);
      this.bindEventHandler(this.onBeforeLoadEmitter, frameModel?.onBeforeLoadHandler);
      this.bindEventHandler(this.onAfterLoadEmitter, frameModel?.onAfterLoadHandler);
    }
  }

  // noinspection JSMethodCanBeStatic
  private bindEventHandler(eventEmitter: EventEmitter<MaFrameEvent>, frameHandler?: MaFrameHandler): void {
    if (MaTypeUtil.isFunction(frameHandler)) {
      eventEmitter.subscribe(frameHandler);
    }
  }

  private buildFrameEvent(customEvent: CustomEvent): MaFrameEvent {
    return {
      customEvent: customEvent,
      frameComponent: this,
    } as MaFrameEvent;
  }

  public isInvalidAttributes(): boolean {
    return MaTypeUtil.isEmptyString(this.appName) || MaTypeUtil.isEmptyString(this.appUrl) || MaTypeUtil.isEmptyString(this.baseRoute);
  }

  public isEffectiveAttributes(): boolean {
    return !this.isInvalidAttributes();
  }

  public isErrorComponent(): boolean {
    return this.errorSupported && this.errorComponent;
  }

  public nonErrorComponent(): boolean {
    return !this.isErrorComponent();
  }

  private openErrorComponent(): void {
    this.errorComponent = true;
  }

  private closeErrorComponent(): void {
    this.errorComponent = false;
  }

  public handleCreated(customEvent: any): void {
    this.onBeforeLoadEmitter.emit(this.buildFrameEvent(customEvent));
    this.onCreatedEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeCreated(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onCreatedEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleBeforeMount(customEvent: any): void {
    this.closeErrorComponent();
    this.onBeforeMountEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeBeforeMount(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeMountEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleMounted(customEvent: any): void {
    this.onAfterLoadEmitter.emit(this.buildFrameEvent(customEvent));
    this.onMountedEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeMounted(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onMountedEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleUnmount(customEvent: any): void {
    this.onUnmountEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeUnmount(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onUnmountEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleError(customEvent: any): void {
    this.openErrorComponent();
    this.onAfterLoadEmitter.emit(this.buildFrameEvent(customEvent));
    this.onErrorEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeError(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onErrorEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleAfterHidden(customEvent: any): void {
    this.onAfterHiddenEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeAfterHidden(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterHiddenEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleBeforeShow(customEvent: any): void {
    this.onAfterLoadEmitter.emit(this.buildFrameEvent(customEvent));
    this.onBeforeShowEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeBeforeShow(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeShowEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public handleAfterShow(customEvent: any): void {
    this.onAfterShowEmitter.emit(this.buildFrameEvent(customEvent));
  }

  public subscribeAfterShow(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterShowEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public subscribeBeforeLoad(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onBeforeLoadEmitter.subscribe(frameHandler, errorHandler, completeHandler);
  }

  public subscribeAfterLoad(frameHandler: MaFrameHandler, errorHandler?: MaErrorHandler, completeHandler?: MaCompleteHandler): void {
    this.onAfterLoadEmitter.subscribe(frameHandler, errorHandler, completeHandler);
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
      baseRoute: this.baseRoute,
      autoRoute: this.autoRoute,
      disableSandbox: this.disableSandbox,
      disableScopeCss: this.disableScopeCss,
      preFetch: this.preFetch,
    } as MaFrameConfig;
  }

}
