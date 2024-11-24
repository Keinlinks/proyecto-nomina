import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { NominalSalary } from '../../models/nominalSalary';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyParsePipe } from '../../pipes/currency-parse.pipe';
import { SalaryForm } from '../../models/salaryForm';
import { ApiService } from '../../services/api.service';
import { Payroll } from '../../models/Payroll';


@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    CurrencyParsePipe,
  ],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent implements OnInit {
  apiService = inject(ApiService);
  ngOnInit(): void {
    if (this.readOnlyNominal) {
      this.nominalSalaryForm.setValue({
        salary_per_day: this.readOnlyNominal.salary_per_day,
        day_worked: this.readOnlyNominal.day_worked,
        extra_hours: this.readOnlyNominal.extra_hours,
        extra_price_per_hour: this.readOnlyNominal.extra_price_per_hour,
        bonus: this.readOnlyNominal.bonus,
        afp: this.readOnlyNominal.afp,
        health_system: this.readOnlyNominal.health_system,
      });
      this.nominalSalaryData.push(this.readOnlyNominal);
    }
  }
  nominalSalaryData: NominalSalary[] = [];
  @Input() readOnlyNominal: Payroll | null = null;
  @Input() rut: string | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Input() editMode = false;
  loading = false;
  displayedColumns: string[] = [
    'salary_per_day',
    'day_worked',
    'imponible_rent',
    'extra_hours',
    'extra_price_per_hour',
    'bonus',
    'imponible_salary',
    'afp_tax',
    'health_system_tax',
    'rent_tax',
    'liquid_salary',
  ];

  http = inject(HttpClient);
  cd = inject(ChangeDetectorRef);
  nominalSalaryResult: string = '';
  salaryLiquid = 0;
  salaryBruto = 0;
  nominalSalaryForm = new FormGroup({
    salary_per_day: new FormControl(0, [Validators.required]),
    day_worked: new FormControl(0, [Validators.required]),
    extra_hours: new FormControl(0, [Validators.required]),
    extra_price_per_hour: new FormControl(0, [Validators.required]),
    bonus: new FormControl(0, [Validators.required]),
    afp: new FormControl('', [Validators.required]),
    health_system: new FormControl('', [Validators.required]),
  });

  calculateNominal() {
    if (this.nominalSalaryForm && this.nominalSalaryForm.invalid) return;
    this.loading = true;
    this.nominalSalaryData = [];
    this.cd.detectChanges();
    this.http
      .post<NominalSalary>(
        'calculator/nominaSalary',
        this.nominalSalaryForm.getRawValue()
      )
      .subscribe((result) => {
        this.nominalSalaryData.push(result);
        this.loading = false;
        this.cd.detectChanges();
      });
  }

  savePayroll(){
    if (!this.rut) return;
    let fomrValues = this.nominalSalaryData[0];
    let payroll: Payroll = {
      id: this.readOnlyNominal ? this.readOnlyNominal.id : undefined,
      afp: fomrValues.afp || '',
      bonus: fomrValues.bonus,
      day_worked: fomrValues.day_worked,
      extra_hours: fomrValues.extra_hours,
      extra_price_per_hour: fomrValues.extra_price_per_hour,
      health_system: fomrValues.health_system,
      salary_per_day: fomrValues.salary_per_day,
      rut: this.rut,
      imponible_salary: fomrValues.imponible_salary,
      imponible_rent: fomrValues.imponible_rent,
      liquid_salary: fomrValues.liquid_salary,
      afp_tax: fomrValues.afp_tax,
      health_system_tax: fomrValues.health_system_tax,
      rent_tax: fomrValues.rent_tax,
    };
    if (payroll.id) {
      this.apiService.updatePayroll(payroll).subscribe((payroll) => {
        this.closeModal.emit();
      });
    }
    else
    this.apiService.savePayroll(payroll).subscribe((payroll) => {
      this.closeModal.emit();
    });
  };
}
