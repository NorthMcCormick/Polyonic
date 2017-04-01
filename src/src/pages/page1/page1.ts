import { Component } from '@angular/core';
import { Device, AppVersion, Clipboard } from 'ionic-native';
import { NavController, Platform } from 'ionic-angular';

declare var window;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  public version: any = '';
  public dplatform: any = '';
  public deviceModel: any = '';

  public appVersion: any = '';
  public appName: any = '';
  public appPackageName: any = '';
  public appVersionCode: any = '';

  public clipboardCopy: string = 'COPY ME';
  public clipboardPaste: string = '';

  constructor(public navCtrl: NavController, public platform: Platform) {
    var pltReady = this.platform.ready(); 

    pltReady.then((readySource) => {
      this.ready();
    });

    // Temporary
    if(!window.isCordovaApp) {
      this.ready();
    }
  }
  
  ready() {

    console.log('Device from app: ', Device);

    this.version = Device.version;
    this.deviceModel = Device.model;
    this.dplatform = Device.platform;

    AppVersion.getVersionNumber().then((value) => {
      this.appVersion = value;
      console.log(value);
    }, (error) => {
      console.error(error);
    })

    AppVersion.getPackageName().then((value) => {
      this.appPackageName = value;
      console.log(value);
    }, (error) => {
      console.error(error);
    })

    AppVersion.getAppName().then((value) => {
      this.appName = value;
      console.log(value);
    }, (error) => {
      console.error(error);
    })

    AppVersion.getVersionCode().then((value) => {
      this.appVersionCode = value;
      console.log(value);
    }, (error) => {
      console.error(error);
    })
  }

  copy() {
    Clipboard.copy(this.clipboardCopy);
  }

  paste() {
    Clipboard.paste().then((text) => {
      this.clipboardPaste = text;
    });
  }
}
