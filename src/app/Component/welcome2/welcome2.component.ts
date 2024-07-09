import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome2',
  standalone: true,
  imports: [],
  templateUrl: './welcome2.component.html',
  styleUrl: './welcome2.component.css',
})
export class Welcome2Component {
  title = 'Bienvenido a la Clínica SMG';
  description =
    'Nuestra misión es brindarte la mejor atención médica. Por favor, selecciona una de las opciones para continuar.';

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
