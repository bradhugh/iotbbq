import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CookComponent } from './components/cook/cook.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'cook/:id',
        component: CookComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
