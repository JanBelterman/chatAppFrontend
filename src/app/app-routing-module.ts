import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component'
import { ChatComponent } from './chats/chat/chat.component';
import { ChatsComponent } from './chats/chats.component';
import { Authguard } from './guards/authguard.service';
import { CreateComponent } from './chats/create/create.component';
import { CreategroupComponent } from './chats/creategroup/creategroup.component';
import { GroupusersComponent } from './chats/groupusers/groupusers.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/chats', pathMatch: 'full' },
    {
        path: 'chats', component: ChatsComponent, canActivate: [Authguard], children: [
            { path: ':id', component: ChatComponent }
        ]
    },
    { path: 'newchat', component: CreateComponent, canActivate: [Authguard] },
    { path: 'createGroup', component: CreategroupComponent, canActivate: [Authguard] },
    { path: 'groupusers/:id', component: GroupusersComponent, canActivate: [Authguard] },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
