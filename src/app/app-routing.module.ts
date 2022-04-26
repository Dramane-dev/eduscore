import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddSubectDashboardComponent } from './components/add-subect-dashboard/add-subect-dashboard.component';

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "addSubject", component: AddSubectDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
