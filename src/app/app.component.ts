import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EduscoreService } from './services/eduscore.service';
import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _translate: TranslateService, private _eduScoreService: EduscoreService, private _electronService: ElectronService) {
    this._translate.setDefaultLang('fr');
  }

  ngOnInit(): void {
    this._electronService.on('update-data', () => {
      this._eduScoreService.refreshData();
    });
    this._electronService.on('import-data', (event: any, data: string) => {
      this._eduScoreService.import(JSON.parse(data));
    });
  }
}
