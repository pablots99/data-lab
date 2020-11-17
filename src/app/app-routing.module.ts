import { componentFactoryName } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatorComponent } from './creator/creator.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { VisualizerComponent } from './visualizer/visualizer.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'creator',
    component: CreatorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visualizer',
    component: VisualizerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
