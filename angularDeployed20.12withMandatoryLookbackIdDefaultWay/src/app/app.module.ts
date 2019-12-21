import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { NgbdModalBasic } from './admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpRequestService } from './http-request.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



const appRoutes: Routes = [
  {path:'AdminDashboard', component:AdminDashboardComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent

    

  ],



  imports: [

    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    
  ],
  providers: [HttpRequestService, AdminDashboardComponent],



  bootstrap: [
    AppComponent,
  ],
  entryComponents: []
 
})

export class AppModule { }

export class NgbdModalBasicModule {}
