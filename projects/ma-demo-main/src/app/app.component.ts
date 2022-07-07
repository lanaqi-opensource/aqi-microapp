import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { MaFrameConfig } from '../../../ng-microapp/src/lib/context/ma-frame-config';
import { MaMainService } from '../../../ng-microapp/src/lib/support/ma-main.service';

@Component({
  selector: 'ma-main-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {

  name: string = 'main-app';

  loadSubApp: boolean = false;

  @ViewChild('customErrorTemplate')
  customErrorTemplate?: TemplateRef<void>;

  constructor(private mainService: MaMainService) {
  }

  ngOnInit(): void {

  }

  gotoSubApp1(): void {
    this.mainService.navigateByUrl('/app/sub-app1');
  }

  gotoSubApp2(): void {
    this.mainService.navigateByUrl('/app/sub-app2');
  }

  sendGlobalData1(): void {
    this.mainService.sendGlobalData({
      title: 'main-app sendGlobalData1',
      message: 'hello',
      summary: '1',
    });
  }

  sendGlobalData2(): void {
    this.mainService.changeGlobalData({
      title: 'main-app sendGlobalData2',
      message: 'hello world',
      append: 'append main-app',
    });
  }

  sendAppData1(): void {
    this.mainService.sendAppData('sub-app1', {
      title: 'main-app > sub-app1 sendAppData1',
      message: 'hello',
      summary: '1',
    });
  }

  sendAppData2(): void {
    this.mainService.changeAppData('sub-app1', {
      title: 'main-app > sub-app1 sendAppData2',
      message: 'hello',
      append: 'append main-app',
    });
  }

  sendAppData3(): void {
    this.mainService.sendAppData('sub-app2', {
      title: 'main-app > sub-app2 sendAppData3',
      message: 'hello',
      summary: '3',
    });
  }

  getGlobalData(): void {
    console.log('main-app getGlobalData', this.mainService.gainGlobalData());
  }

  ngAfterViewInit(): void {

    const frameConfigs: MaFrameConfig[] = [
      {
        appUrl: 'http://localhost:4201',
        appName: 'sub-app1',
        // todo 开启 keepAlive 模式以后，如果加载失败则不会自动恢复，不推荐使用
        keepAlive: false,
        // todo 开启 shadowDom 模式以后 shares 样式则不生效，默认情况下，框架默认不开启 shadowDom 模式
        shadowDom: false,
        // 开启预加载
        preFetch: true,
      },
      {
        appUrl: 'http://localhost:4202',
        appName: 'sub-app2',
        // todo 开启 keepAlive 模式以后，如果加载失败则不会自动恢复，不推荐使用
        keepAlive: true,
        // todo 开启 shadowDom 模式以后 shares 样式则不生效，默认情况下，框架默认不开启 shadowDom 模式
        shadowDom: false,
      },
    ];

    this.mainService.registerFrames(frameConfigs, true, this.customErrorTemplate);

    this.mainService.startFrames();

    this.mainService.subscribeAppData(dataRecord => {
      console.log('main-app subscribeAppData->', dataRecord);
    });
    this.mainService.subscribeGlobalData(dataRecord => {
      console.log('main-app subscribeGlobalData->', dataRecord);
    });
    this.mainService.subscribeFrameBeforeLoad(frameEvent => {
      this.loadSubApp = true;
    });
    this.mainService.subscribeFrameAfterLoad(frameEvent => {
      this.loadSubApp = false;
    });

  }

}
