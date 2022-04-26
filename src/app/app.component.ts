import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eduScore';

  constructor(private _translate: TranslateService) {
    this._translate.setDefaultLang('fr');
  }

  ngOnInit(): void {}
}