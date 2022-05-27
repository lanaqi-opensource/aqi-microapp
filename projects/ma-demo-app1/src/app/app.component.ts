import { Component, OnInit } from '@angular/core';

import { MaSubService } from '../../../ng-microapp/src/lib/support/ma-sub.service';

@Component({
  selector: 'ma-app1-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  name: string = 'sub-app1';

  constructor(private subService: MaSubService) {
  }

  ngOnInit(): void {
    this.subService.startFrame();
    this.subService.subscribeAppData((dataRecord => {
      console.log('sub-app1 subscribeAppData->', dataRecord);
    }));
    this.subService.subscribeGlobalData((dataRecord => {
      console.log('sub-app1 subscribeGlobalData->', dataRecord);
    }));
  }

  sendGlobalData(): void {
    this.subService.sendGlobalData({
      title: 'sub-app1 sendGlobalData',
      message: 'hello',
      summary: '1',
    });
  }

  sendAppData1(): void {
    this.subService.sendAppData({
      title: 'sub-app1 sendAppData1',
      message: 'hello',
      summary: '1',
    });
  }

  sendAppData2(): void {
    this.subService.changeAppData({
      title: 'sub-app1 sendAppData2',
      message: 'hello',
      append: 'append sub-app1',
    });
  }

  getGlobalData(): void {
    console.log('sub-app1 getGlobalData', this.subService.gainGlobalData());
  }

  getAppData(): void {
    console.log('sub-app1 getGlobalData', this.subService.gainAppData());
  }

  gotoSubApp2Page3(): void {
    this.subService.navigateByUrl('/app/sub-app2/page3');
  }

  gotoSubApp2Page4(): void {
    this.subService.navigateByUrl('/app/sub-app2/page4');
  }

}
