import { Component, inject, OnInit } from '@angular/core';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { convertTimestampToDate } from '../../utils/date';
import { Timestamp } from 'firebase/firestore';
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng-charts';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-graphic',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css'],
})
export class GraphicComponent implements OnInit {
  appoiments: Appointment[] = [];
  appointmentService = inject(AppointmentService);
  specialtyChartData!: ChartData<'bar'>;
  dayChartData!: ChartData<'line'>;
  doctorChartData!: ChartData<'pie'>;
  completedDoctorChartData!: ChartData<'doughnut'>;

  specialtyChartOptions: ChartOptions = { responsive: true };
  dayChartOptions: ChartOptions = { responsive: true };
  doctorChartOptions: ChartOptions = { responsive: true };
  completedDoctorChartOptions: ChartOptions = { responsive: true };

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.appoiments = data.map((appointment) => {
        const createdAtDate: Date = convertTimestampToDate(
          appointment.createdAt as unknown as Timestamp
        );
        const updatedAtDate: Date = convertTimestampToDate(
          appointment.updatedAt as unknown as Timestamp
        );
        const dateDate: Date = convertTimestampToDate(
          appointment.date as unknown as Timestamp
        );
        return {
          ...appointment,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
          date: dateDate,
        };
      });
      const specialtyCounts = this.countAppointmentsBySpecialty(
        this.appoiments
      );
      const dayCounts = this.countAppointmentsByDay(this.appoiments);
      const doctorCounts = this.countAppointmentsByDoctor(this.appoiments);
      const completedDoctorCounts = this.countCompletedAppointmentsByDoctor(
        this.appoiments
      );

      this.specialtyChartData = {
        labels: Object.keys(specialtyCounts),
        datasets: [
          {
            data: Object.values(specialtyCounts),
            label: 'Turnos por Especialidad',
          },
        ],
      };

      this.dayChartData = {
        labels: Object.keys(dayCounts),
        datasets: [{ data: Object.values(dayCounts), label: 'Turnos por Día' }],
      };

      this.doctorChartData = {
        labels: Object.keys(doctorCounts),
        datasets: [
          {
            data: Object.values(doctorCounts),
            label: 'Turnos por Médico',
          },
        ],
      };

      this.completedDoctorChartData = {
        labels: Object.keys(completedDoctorCounts),
        datasets: [
          {
            data: Object.values(completedDoctorCounts),
            label: 'Turnos Finalizados por Médico',
          },
        ],
      };
    });
  }

  countAppointmentsBySpecialty = (
    appointments: Appointment[]
  ): Record<string, number> =>
    appointments.reduce((acc, appointment) => {
      acc[appointment.specialty] = (acc[appointment.specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  countAppointmentsByDay = (
    appointments: Appointment[]
  ): Record<string, number> =>
    appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      const dateSet = `${day}/${month}/${year}`;
      acc[dateSet] = (acc[dateSet] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  countAppointmentsByDoctor = (
    appointments: Appointment[]
  ): Record<string, number> =>
    appointments.reduce((acc, appointment) => {
      acc[appointment.specialistName] =
        (acc[appointment.specialistName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  countCompletedAppointmentsByDoctor = (
    appointments: Appointment[]
  ): Record<string, number> =>
    appointments.reduce((acc, appointment) => {
      if (appointment.status === Status.COMPLETED) {
        acc[appointment.specialistName] =
          (acc[appointment.specialistName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };
}
