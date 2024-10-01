import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { UserDisplayInformation } from '../../models/enums';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  form!: FormGroup;
  userSelected = false;
  pdf!: pdfMake.TCreatedPdf;
  pdfGenerated = false;
  displayedColumns: string[] = [
    'id',
    'name',
    'rut',
    'dateIn',
    'dateOut',
    'afp',
  ];
  dataSource = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      rut: '12345678901',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      title: 'Ingeniero de Sistemas',
      afp: 'Capital',
      disability: 'No',
      pension: 'No',
      healthSystem: 'FONASA',
    },
    {
      id: 2,
      name: 'Alice',
      lastName: 'Smith',
      rut: '98765432109',
      dateIn: '2019-03-15',
      dateOut: '2021-05-30',
      title: 'Analista de Datos',
      afp: 'Cuprum',
      disability: 'No',
      pension: 'Sí',
      healthSystem: 'Provida',
    },
    {
      id: 3,
      name: 'Carlos',
      lastName: 'González',
      rut: '13579246810',
      dateIn: '2018-02-01',
      dateOut: '2022-11-15',
      title: 'Desarrollador Full Stack',
      afp: 'Cuprum',
      disability: 'Sí',
      pension: 'No',
      healthSystem: 'ISAPRE',
    },
    {
      id: 4,
      name: 'Maria',
      lastName: 'Pérez',
      rut: '24681012141',
      dateIn: '2021-07-10',
      dateOut: '2023-06-01',
      title: 'Especialista en Marketing',
      afp: 'Habitat',
      disability: 'No',
      pension: 'Sí',
      healthSystem: 'ISAPRE',
    },
    {
      id: 5,
      name: 'Javier',
      lastName: 'Fernández',
      rut: '11223344556',
      dateIn: '2017-04-20',
      dateOut: '2019-09-30',
      title: 'Ingeniero Civil',
      afp: 'Habitat',
      disability: 'No',
      pension: 'No',
      healthSystem: 'ISAPRE',
    },
    {
      id: 6,
      name: 'Laura',
      lastName: 'Martínez',
      rut: '99887766554',
      dateIn: '2020-08-05',
      dateOut: '2022-12-31',
      title: 'Contadora Pública',
      afp: 'Capital',
      disability: 'No',
      pension: 'Sí',
      healthSystem: 'FONASA',
    },
    {
      id: 7,
      name: 'Miguel',
      lastName: 'Ramírez',
      rut: '55443322111',
      dateIn: '2019-09-01',
      dateOut: '2021-12-01',
      title: 'Gerente de Proyectos',
      afp: 'Capital',
      disability: 'Sí',
      pension: 'No',
      healthSystem: 'FONASA',
    },
  ];

  ngOnInit(): void {
    this.form = new FormGroup({
      personalInformation: new FormGroup({
        name: new FormControl(''),
        lastName: new FormControl(''),
        rut: new FormControl(''),
        birthDate: new FormControl(''),
      }),
      laboralInformation: new FormGroup({
        entryDate: new FormControl(''),
        exitDate: new FormControl(''),
        title: new FormControl(''),
      }),
      complementaryInformation: new FormGroup({
        disability: new FormControl(''),
        pension: new FormControl(''),
        afp: new FormControl(''),
        healthSystem: new FormControl(''),
      }),
    });
  }

  selectedUser(user: any) {
    document.querySelector('#iframeContainer')?.remove();
    this.form.reset();
    this.pdfGenerated = false;
    this.tabGroup.selectedIndex = 1;
    this.userSelected = true;
    this.form.get('personalInformation')?.setValue({
      name: user.name,
      lastName: user.lastName,
      rut: user.rut,
      birthDate: user.dateIn,
    });
    this.form.get('laboralInformation')?.setValue({
      entryDate: user.dateIn,
      exitDate: user.dateOut,
      title: user.title,
    });
    this.form.get('complementaryInformation')?.setValue({
      disability: user.disability,
      pension: user.pension,
      afp: user.afp,
      healthSystem: user.healthSystem,
    });
  }
  getStringOrNumberValues(
    obj: any,
    prefix: string = ''
  ): [string, string | number][] {
    const result: [string, string | number][] = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const currentKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string' || typeof value === 'number') {
          if (key in UserDisplayInformation) result.push([key, value]);
        } else if (typeof value === 'object' && value !== null) {
          result.push(...this.getStringOrNumberValues(value, currentKey));
        }
      }
    }
    return result;
  }
  createResume() {
    this.pdfGenerated = true;
    let pdfContainer = this.pdfContainer.nativeElement as HTMLElement;
    pdfContainer.innerHTML = '';
    document.querySelector('#iframeContainer')?.remove();
    let userData = this.form.getRawValue();
    let information = this.getStringOrNumberValues(userData);
    information.forEach((item) => {
      let key: keyof typeof UserDisplayInformation;
      key = item[0] as keyof typeof UserDisplayInformation;
      item[0] = UserDisplayInformation[key];
    });
    let linesInfo = information.map((inf) => {
      return inf[0] + ': ' + (inf[1] || '-');
    });
    let docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      header: { text: 'Resumen de nomina', style: 'header' },
      footer: 'Esto es un resumen de los datos.',
      content: [...linesInfo],
      defaultStyle: {
        font: 'Roboto',
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
        },
      },
    };

    this.pdf = pdfMake.createPdf(docDefinition, undefined, {
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    });
    this.pdf.getDataUrl((dataUrl) => {
      const targetElement = document.querySelector('#iframeContainer');
      const iframe = document.createElement('iframe');
      iframe.style.width = '500px';
      iframe.style.height = '600px';
      iframe.src = dataUrl;
      targetElement?.appendChild(iframe);
    });
    this.tabGroup.selectedIndex = 2;
  }

  saveChanges() {}
}
