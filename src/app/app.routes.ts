import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'
import { LabsComponent } from './pages/labs/labs.component'

export const routes: Routes = [
  {
    path: '', // si dejamos el path como string vacio se renderizara el componente en el inicio de la pagina
    component: HomeComponent
  },
  {
    path: 'labs',
    component: LabsComponent
  }
];
