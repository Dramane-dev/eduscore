import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AddSubectDashboardComponent } from './components/add-subect-dashboard/add-subect-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScoreDashboardComponent } from './components/score-dashboard/score-dashboard.component';
import { AddScoreComponent } from './components/add-score/add-score.component';
import { BackupComponent } from './components/backup/backup.component';
import { DndDirective } from './directives/dnd.directive';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddSubectDashboardComponent,
    ScoreDashboardComponent,
    AddScoreComponent,
    BackupComponent,
    DndDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
