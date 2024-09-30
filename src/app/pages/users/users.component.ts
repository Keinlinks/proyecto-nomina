import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, viewChild } from '@angular/core';
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
  form!: FormGroup;
  userSelected = false;
  pdf!: pdfMake.TCreatedPdf;
  displayedColumns: string[] = [
    'id',
    'name',
    'rut',
    'dateIn',
    'dateOut',
    'afp',
  ];
  displayInformation = {
    name: { label: 'Nombres', value: 'name' },
    lastName: { label: 'Apellidos', value: 'lastName' },
    rut: { label: 'Rut', value: 'rut' },
    birthDate: { label: 'Fecha de nacimiento', value: 'birthDate' },
    pension: { label: 'Pensionado', value: 'pension' },
    disability: { label: 'Discapacidad', value: 'disability' },
    afp: { label: 'AFP', value: 'afp' },
    healthSystem: { label: 'Sistema de salud', value: 'healthSystem' },
  };
  dataSource = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      rut: '12345678901',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '100',
    },
    {
      id: 2,
      name: 'Jane',
      lastName: 'Doe',
      rut: '12345678902',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '200',
    },
    {
      id: 3,
      name: 'Joe',
      lastName: 'Doe',
      rut: '12345678903',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '300',
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
    this.tabGroup.selectedIndex = 1;
    this.userSelected = true;
    this.form.get('personalInformation')?.setValue({
      name: user.name,
      lastName: user.lastName,
      rut: user.rut,
      birthDate: user.dateIn,
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
    this.tabGroup.selectedIndex = 2;

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
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      iframe.src = dataUrl;
      targetElement?.appendChild(iframe);
    });
  }

  saveChanges() {}
}
