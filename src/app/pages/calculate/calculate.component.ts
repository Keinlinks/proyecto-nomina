import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatButtonModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent {
  http = inject(HttpClient);
  cd = inject(ChangeDetectorRef);
  nominalSalaryResult: string = '';
  salaryLiquid = 0;
  salaryBruto = 0;
  nominalSalaryForm = new FormGroup({
    salary: new FormControl(0, [Validators.required]),
    hours: new FormControl(0, [Validators.required]),
    bonus: new FormControl(0, [Validators.required]),
    commission: new FormControl(0, [Validators.required]),
    afp: new FormControl('', [Validators.required]),
  });
  calculateNominal(){
    if (this.nominalSalaryForm && this.nominalSalaryForm.invalid) return;
    this.http
      .post<string>(
        'calculator/nominaSalary',
        this.nominalSalaryForm.getRawValue()
      )
      .subscribe((result) => {
        let form:any = this.nominalSalaryForm.getRawValue();
        this.salaryBruto = form.salary * form.hours + form.bonus;
        this.salaryLiquid = +result;
        this.cd.detectChanges();
      });
  }
}
