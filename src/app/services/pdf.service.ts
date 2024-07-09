import { Injectable } from '@angular/core';
import { Appointment } from '../Interfaces/Appointment ';
import jsPDF from 'jspdf';

interface Data extends Appointment {
  historical?: Record<string, string | number>;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  public generatePdf(
    appointments: Data[],
    logoUrl: string,
    reportTitle: string
  ): void {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(logoUrl, 'PNG', pageWidth / 2 - 15, 10, 30, 30);

    pdf.setFontSize(18);
    pdf.text(reportTitle, pageWidth / 2, 50, { align: 'center' });

    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(12);
    pdf.text(`Fecha de emisión: ${currentDate}`, pageWidth / 2, 60, {
      align: 'center',
    });

    let y = 70;

    appointments.forEach((appointment) => {
      if (!appointment.historical) return;
      const keyValue = Object.keys(appointment.historical).map((key) => ({
        key,
        value: appointment.historical?.[key],
      }));

      pdf.setFontSize(10);
      pdf.text(`Codigo turno: ${appointment.id || 'N/A'}`, 10, y);
      y += 10;
      pdf.text(`DNI: ${appointment.patientId || 'N/A'}`, 10, y);
      y += 10;
      pdf.text(`Especialista: ${appointment.specialistName}`, 10, y);
      y += 10;
      pdf.text(`Especialidad: ${appointment.specialty}`, 10, y);
      y += 10;
      pdf.text(`Fecha del turno: ${appointment.date}`, 10, y);
      y += 10;
      if (appointment.review) {
        pdf.text(
          `Review Comment: ${appointment.review.comment || 'N/A'}`,
          10,
          y
        );
        y += 10;
      }
      if (appointment.survey) {
        pdf.text(`Survey: ${appointment.survey}`, 10, y);
        y += 10;
      }
      keyValue.forEach(({ key, value }) => {
        pdf.text(`${key}: ${value}`, 15, y);
        y += 5;
      });

      if (y > 280) {
        pdf.addPage();
        y = 10;
      }

      y += 10;
    });

    pdf.save('appointments.pdf');
  }
}
