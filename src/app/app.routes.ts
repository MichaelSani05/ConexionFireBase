import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { FormulariosComponent } from './pages/formularios/formularios.component';
import { ConsultarOfertasComponent } from './pages/consultar-ofertas/consultar-ofertas.component';
import { ConsultarSolicitudesComponent } from './pages/consultar-solicitudes/consultar-solicitudes.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {path: "", component: MainComponent},
    {path: "home", component: MainComponent},
    {path: "Formularios", component: FormulariosComponent},
    {path: "ConsultarOfertas", component: ConsultarOfertasComponent},
    {path: "ConsultarSolicitudes", component: ConsultarSolicitudesComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
];
