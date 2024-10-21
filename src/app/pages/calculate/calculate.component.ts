import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  nominalSalaryForm = new FormGroup({
    salary: new FormControl(0),
    hours: new FormControl(0),
    bonus: new FormControl(0),
    commission: new FormControl(0),
    afp: new FormControl(''),
  });
  calculateNominal(){
    this.http.post('nominalSalary',this.nominalSalaryForm.getRawValue()).subscribe(result=>{

    })
  }
}
