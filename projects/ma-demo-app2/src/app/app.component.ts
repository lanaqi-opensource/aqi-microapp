import { Component, OnInit } from '@angular/core';

import { MaSubService } from '../../../ng-microapp/src/lib/support/ma-sub.service';

@Component({
  selector: 'ma-app2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  name: string = 'sub-app2';

  constructor(private subService: MaSubService) {
  }

  ngOnInit(): void {
    this.subService.startFrame();
    this.subService.subscribeAppData((dataRecord => {
      console.log('sub-app2 subscribeAppData->', dataRecord);
    }));
    this.subService.subscribeGlobalData((dataRecord => {
      console.log('sub-app2 subscribeGlobalData->', dataRecord);
    }));
  }

  sendGlobalData(): void {
    this.subService.sendGlobalData({
      title: 'sub-app2 sendGlobalData',
      message: 'hello',
      summary: '1',
    });
  }

  sendAppData1(): void {
    this.subService.sendAppData({
      title: 'sub-app2 sendAppData1',
      message: 'hello',
      summary: '1',
    });
  }

  sendAppData2(): void {
    this.subService.changeAppData({
      title: 'sub-app2 sendAppData2',
      message: 'hello',
      append: 'append sub-app2',
    });
  }

  getGlobalData(): void {
    console.log('sub-app2 getGlobalData', this.subService.gainGlobalData());
  }

  getAppData(): void {
    console.log('sub-app2 getGlobalData', this.subService.gainAppData());
  }

  gotoSubApp1Page1(): void {
    this.subService.navigateByUrl('/app/sub-app1/page1');
  }

  gotoSubApp1Page2(): void {
    this.subService.navigateByUrl('/app/sub-app1/page2');
  }

}
