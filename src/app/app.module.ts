import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { GridComponent } from './grid/grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { CategoryComponent } from './category/category.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CompareImageComponent } from './compare-image/compare-image.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailPageComponent,
    GridComponent,
    CategoryComponent,
    SidenavComponent,
    CompareImageComponent,
  ],entryComponents:[],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    AgGridModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
