import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { NgModule } from '@angular/core';
import { FormComponent } from './pages/form/form/form.component';

export const routes: Routes = 
[
    {path: 'products', component: ListComponent},
    {path: 'products/new', component: FormComponent},
    {path: 'products/edit/:id', component: FormComponent},
    {path: '', redirectTo: '/products', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}
