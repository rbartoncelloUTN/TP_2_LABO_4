import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { IcecreamAddComponent } from '../icecream-add/icecream-add.component';
@Component({
  selector: 'app-icecream-list',
  standalone: true,
  imports: [CommonModule, IcecreamAddComponent],
  templateUrl: './icecream-list.component.html',
  styleUrl: './icecream-list.component.css',
})
export class IcecreamListComponent implements OnInit {
  public icecreans!: any[];
  public icecrean!: any;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    let col = collection(this.firestore, 'ice-creams');

    const observable = collectionData(col);

    observable.subscribe((data) => {
      this.icecreans = data as any[];
    });
  }

  handleOnClick(icecrean: any): void {
    console.log(icecrean);
    this.icecrean = icecrean;
  }
}
