import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { DetailPageComponent } from './detail-page/detail-page.component';

const routes: Routes = [
  { path: '', component: GridComponent, pathMatch: 'full' },
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
