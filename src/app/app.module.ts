import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing-module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ListComponent } from './chats/list/list.component';
import { ChatComponent } from './chats/chat/chat.component';
import { ChatsComponent } from './chats/chats.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { CreateComponent } from './chats/create/create.component';
import { CreategroupComponent } from './chats/creategroup/creategroup.component';
import { GroupusersComponent } from './chats/groupusers/groupusers.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    SigninComponent,
    ListComponent,
    ChatComponent,
    ChatsComponent,
    ShortenPipe,
    CreateComponent,
    CreategroupComponent,
    GroupusersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
