import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatorComponent } from './creator/creator.component';
import { VisualizerComponent } from './visualizer/visualizer.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch:  'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'creator',
    component: CreatorComponent
  },
  {
    path: 'visualizer',
    component: VisualizerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
