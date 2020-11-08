import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './pages/general/general.component';
import { HomeComponent } from './pages/general/home/home.component';
import { AboutUsComponent } from './pages/general/about-us/about-us.component';
import { InfoComponent } from './pages/info/info.component';

const routes: Routes = [
  /** General */
  {
    path: '',
    component: GeneralComponent,
    children: [
      /** Sub pages */
      { path: '', component: HomeComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'info', component: InfoComponent }
    ],
  },
  { 
    path: '**', 
    redirectTo: '/',
    pathMatch: 'full' 
  }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
