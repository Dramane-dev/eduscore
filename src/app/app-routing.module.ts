import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddScoreComponent } from './components/add-score/add-score.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddSubectDashboardComponent } from './components/add-subect-dashboard/add-subect-dashboard.component';
import { ScoreDashboardComponent } from './components/score-dashboard/score-dashboard.component';
import { BackupComponent } from './components/backup/backup.component';

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "add-subject", component: AddSubectDashboardComponent },
  { path: "score-dashboard/:id", component: ScoreDashboardComponent },
  { path: "add-score", component: AddScoreComponent },
  { path: "add-score/:id", component: AddScoreComponent },
  { path: "backup", component: BackupComponent },
  { path: "**", redirectTo: "/" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
