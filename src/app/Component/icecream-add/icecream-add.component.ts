import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-icecream-add',
  standalone: true,
  imports: [],
  templateUrl: './icecream-add.component.html',
  styleUrl: './icecream-add.component.css',
})
export class IcecreamAddComponent {
  public iceCreamForm!: FormGroup;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.iceCreamForm = new FormGroup({
      sabor: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required, Validators.min(0)]),
      peso: new FormControl('', [
        Validators.required,
        Validators.min(250),
        Validators.max(1000),
      ]),
    });
  }

  onSubmit(): void {
    if (this.iceCreamForm.valid) {
      console.log(this.iceCreamForm.value);
      let col = collection(this.firestore, 'ice-creams');
      addDoc(col, {
        sabor: this.iceCreamForm.value.sabor,
        tipo: this.iceCreamForm.value.tipo,
        precio: this.iceCreamForm.value.precio,
        peso: this.iceCreamForm.value.peso,
      });
      //this.iceCreamForm.reset();
    } else {
      console.log('Formulario no válido');
    }
  }
}
