import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { generateHours, getWeekdayDatesNext15Days } from '../../utils/date';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { ModalComfirmComponent } from '../modal-comfirm/modal-comfirm.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/Auth/auth.service';
import {
  Firestore,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-select-available-days',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HideComponentDirective,
    LoaderComponent,
  ],
  templateUrl: './select-available-days.component.html',
  styleUrl: './select-available-days.component.css',
})
export class SelectAvailableDaysComponent implements OnInit {
  dates = getWeekdayDatesNext15Days();
  firestore = inject(Firestore);
  appointmetOptions: { hour: string; selected: boolean }[] | [] = [];
  readonly dialog = inject(MatDialog);
  authServices = inject(AuthService);
  isLoading = false;
  dateSelected:
    | {
        weekDay: string;
        date: string;
        day: string;
        month: string;
      }
    | undefined;

  get halfLength(): number {
    return Math.ceil(this.appointmetOptions.length / 3);
  }
  dateSaved: { day: string; hours: string[] }[] = [];

  ngOnInit() {
    this.loadAppointments();
  }

  async loadAppointments() {
    const user = this.authServices.getUser();

    if (!user) {
      console.error('User not found');
      return;
    }

    const docRef = doc(this.firestore, 'availablesAppointments', `${user.dni}`);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as { dates: [{ day: string; hours: [] }] };
        this.dateSaved = data?.dates || [];
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  }

  handleDateClick(date: {
    weekDay: string;
    date: string;
    day: string;
    month: string;
  }) {
    this.dateSelected = date;

    this.appointmetOptions = generateHours(
      8,
      date.weekDay === 'sábado' ? 14 : 19
    ).map((data) => {
      return { hour: data, selected: false };
    });

    const hoursSaved = this.dateSaved.find(
      (data) => data.day === `${date?.day}/${date?.month}/2024`
    )?.hours;

    if (hoursSaved) {
      this.appointmetOptions = this.appointmetOptions.map((data) => {
        if (hoursSaved.some((hour) => hour === data.hour)) {
          return { hour: data.hour, selected: true };
        }
        return data;
      });
    }
  }

  isSomeHourSelected(): boolean {
    return this.appointmetOptions.some((item) => item.selected);
  }

  handleHourClick(item: { hour: string; selected: boolean }) {
    item.selected = !item.selected;
  }

  saveSelections(): void {
    const selectedItems = this.appointmetOptions.filter(
      (item) => item.selected
    );
    const selectedItemIds = selectedItems.map((item) => item.hour);
    this.openDialog(selectedItemIds);
  }

  openDialog(selectedItemIds: string[]) {
    const dialogRef = this.dialog.open(ModalComfirmComponent);

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.isLoading = true;
        const user = this.authServices.getUser();

        if (!user) {
          console.error('User not found');
          this.isLoading = false;
          return;
        }

        const docRef = doc(
          this.firestore,
          'availablesAppointments',
          `${user.dni}`
        );

        try {
          this.dateSaved = this.dateSaved.filter(
            (date) =>
              date.day !==
              `${this.dateSelected?.day}/${this.dateSelected?.month}/2024`
          );
          await updateDoc(docRef, {
            dates: [
              ...this.dateSaved,
              {
                day: `${this.dateSelected?.day}/${
                  Number(this.dateSelected?.month) + 1
                }/2024`,
                hours: selectedItemIds,
              },
            ],
          });
        } catch (error) {
          await setDoc(docRef, {
            dates: [
              {
                day: `${this.dateSelected?.day}/${this.dateSelected?.month}/2024`,
                hours: selectedItemIds,
              },
            ],
          });
        }

        this.isLoading = false;
        this.loadAppointments();
        this.appointmetOptions = [];
      } else {
        this.isLoading = false;
      }
    });
  }
}
