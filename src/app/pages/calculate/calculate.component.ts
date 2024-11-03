import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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
    CurrencyParsePipe
  ],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent {
  nominalSalaryData: NominalSalary[] = [];
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
}
