import { Component } from '@angular/core';
import { StudentService } from './shared/services/student.service';
import { UserService } from './shared/services/user.service';
import { Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StudentService, UserService]
})
export class AppComponent {
  title = 'aup-oscms-fe';

  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  //show or hide side menu
  displayMenu = true;

  constructor(public studentService: StudentService, public userService: UserService, private router: Router, private platform: Platform,
    private swUpdate: SwUpdate, private facebookService: FacebookService) {

    this.isOnline = false;
    this.modalVersion = false;
    }
    public ngOnInit(): void {
      this.updateOnlineStatus();
      this.initFacebookService();

      

      window.addEventListener('online',  this.updateOnlineStatus.bind(this));
      window.addEventListener('offline', this.updateOnlineStatus.bind(this));

      if (this.swUpdate.isEnabled) {
        this.swUpdate.versionUpdates.pipe(
          filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map((evt: any) => {
            console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
            this.modalVersion = true;
          }),
        );
      }

      this.loadModalPwa();
    }

    private initFacebookService(): void {
      const initParams: InitParams = { xfbml:true, version:'v3.2'};
      this.facebookService.init(initParams);
    }

    private updateOnlineStatus(): void {
      this.isOnline = window.navigator.onLine;
      console.info(`isOnline=[${this.isOnline}]`);
    }

    public updateVersion(): void {
      this.modalVersion = false;
      window.location.reload();
    }

    public closeVersion(): void {
      this.modalVersion = false;
    }

    private loadModalPwa(): void {
      if (this.platform.ANDROID) {
        window.addEventListener('beforeinstallprompt', (event: any) => {
          event.preventDefault();
          this.modalPwaEvent = event;
          this.modalPwaPlatform = 'ANDROID';
        });
      }

      if (this.platform.IOS && this.platform.SAFARI) {
        const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
        if (!isInStandaloneMode) {
          this.modalPwaPlatform = 'IOS';
        }
      }
    }

    public addToHomeScreen(): void {
      this.modalPwaEvent.prompt();
      this.modalPwaPlatform = undefined;
    }

    public closePwa(): void {
      this.modalPwaPlatform = undefined;
    }

  toogleMenu() {
    this.displayMenu = !this.displayMenu;
  }

  onLogout() {
    this.studentService.deleteToken();
    this.toogleMenu();
  }
}
