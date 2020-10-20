import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './pages/general/general.component';
import { HomeComponent } from './pages/general/home/home.component';


const routes: Routes = [
  /** General */
  {
    path: '',
    component: GeneralComponent,
    children: [
      /** Sub pages */
      { path: '', component: HomeComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
