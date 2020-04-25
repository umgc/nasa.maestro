import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { compareDocxComponent } from './compareDocx/compareDocx.component';
import { convertDocxComponent } from './convertDocx/convertDocx.component';
import { resultsComponent } from './results/results.component';
import { validateDocxComponent } from './validateDocx/validateDocx.component';
import { homeComponent } from './home/home.component';
import { AppRepoService } from './app-repository.service';

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
    component: compareDocxComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'convertDocx',
    component: convertDocxComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'results',
    component: resultsComponent,
    resolve: { projectNames: AppRepoService },
  },
  {
    path: 'validateDocx',
    component: validateDocxComponent,
    resolve: { projectNames: AppRepoService },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
