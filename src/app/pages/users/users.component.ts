import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { UserI } from '../../models/UserI';
import { RutParsePipe } from '../../pipes/rutParse.pipe';
import { CalculateComponent } from '../calculate/calculate.component';
import { Payroll } from '../../models/Payroll';

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
    RutParsePipe,
    MatButtonModule,
    CalculateComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  apiService = inject(ApiService);
  cd = inject(ChangeDetectorRef);
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  form!: FormGroup;
  payrollModal = false;
  loading = false;
  rutSelected: string | null = null;
  readOnlyNominal:Payroll | null = null;
  userSelected = false;
  pdf!: pdfMake.TCreatedPdf;
  pdfGenerated = false;
  displayedColumns: string[] = [
    'name',
    'rut',
    'entry_date',
    'exit_date',
    'afp',
    'payroll',
    'edit'
  ];
  dataSource: UserI[] = [];

  ngOnInit(): void {
    this.form = new FormGroup({
      personalInformation: new FormGroup({
        name: new FormControl(''),
        rut: new FormControl(''),
        birth_date: new FormControl(new Date()),
      }),
      laboralInformation: new FormGroup({
        entryDate: new FormControl(new Date()),
        exitDate: new FormControl(new Date()),
        title: new FormControl(new Date()),
      }),
      complementaryInformation: new FormGroup({
        disability: new FormControl(''),
        pension: new FormControl(''),
        afp: new FormControl(''),
        healthSystem: new FormControl(''),
      }),
    });
    this.apiService.getUsers(0).subscribe((users) => {
      this.dataSource = users;
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
      rut: user.rut,
      birth_date: user.birth_date,
    });
    this.form.get('laboralInformation')?.setValue({
      entryDate: user.entry_date,
      exitDate: user.exit_date,
      title: user.title,
    });
    this.form.get('complementaryInformation')?.setValue({
      disability: user.discapacity ? 'Si' : 'No',
      pension: user.pensioned ? 'Si' : 'No',
      afp: user.afp,
      healthSystem: user.health_system,
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

  getPayroll(user: UserI) {
    this.apiService.getPayroll(user.rut).subscribe((payroll) => {
      console.log(payroll);
      this.readOnlyNominal = payroll;
      this.rutSelected = user.rut;
      this.payrollModal = true;
      this.cd.detectChanges();
    });
  }

  saveChanges() {
    this.loading = true;
    let payload: UserI = {
      rut: this.form.getRawValue().personalInformation.rut,
      name: this.form.getRawValue().personalInformation.name,
      birth_date: this.form.getRawValue().personalInformation.birth_date,
      entry_date: this.form.getRawValue().laboralInformation.entryDate,
      exit_date: this.form.getRawValue().laboralInformation.exitDate,
      title: this.form.getRawValue().laboralInformation.title,
      discapacity:
        this.form.getRawValue().complementaryInformation.disability === 'Si',
      pensioned:
        this.form.getRawValue().complementaryInformation.pension === 'Si',
      afp: this.form.getRawValue().complementaryInformation.afp,
      health_system:
        this.form.getRawValue().complementaryInformation.healthSystem,
      salary_per_day: this.form.getRawValue().laboralInformation.salaryPerDay,
    };
    console.log(payload);
    this.apiService.saveUser(payload).subscribe((user) => {
      alert('Guardado: ' + user.name);
      this.loading = false;
      this.tabGroup.selectedIndex = 0;
      this.apiService.getUsers(0).subscribe((users) => {
        this.dataSource = users;
      });
      this.cd.detectChanges();
    });
  }
}
