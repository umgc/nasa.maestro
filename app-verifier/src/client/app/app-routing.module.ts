import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRepoService } from './app-repository.service';

import { CompareDocxComponent } from './compareDocx/compareDocx.component';
import { ConvertDocxComponent } from './convertDocx/convertDocx.component';
import { ResultsComponent } from './results/results.component';
import { ValidateDocxComponent } from './validateDocx/validateDocx.component';
import { homeComponent } from './home/home.component';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: homeComponent,
    resolve: {projectNames: AppRepoService},
  },
  {
    path: 'compareDocx',
    component: CompareDocxComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'convertDocx',
    component: ConvertDocxComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'results',
    component: ResultsComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'validateDocx',
    component: ValidateDocxComponent,
    resolve: { projectNames: AppRepoService },
  }
];

export class AppRoutingModule {}