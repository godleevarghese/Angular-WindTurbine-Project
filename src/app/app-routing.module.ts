import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPageComponent } from './detail-page/detail-page.component';
import {SidenavComponent} from './sidenav/sidenav.component'

const routes: Routes = [
  { path: '', component: SidenavComponent, pathMatch: 'full' },
  {
    path: 'detail/:id/:date',
    component: DetailPageComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
