import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserI } from '../models/UserI';
import { map } from 'rxjs';
import { NominalSalary } from '../models/nominalSalary';
import { SalaryForm } from '../models/salaryForm';
import { Payroll } from '../models/Payroll';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  constructor() {}

  getUsers(page: number) {
    return this.http.get<UserI[]>('users' + '?page=' + page).pipe(
      map((users) => {
        users.forEach((user) => {
          user.entry_date = new Date(user.entry_date);
          user.exit_date = new Date(user.exit_date);
          user.birth_date = new Date(user.birth_date);
        });
        return users;
      })
    );
  }

  saveUser(user: UserI) {
    return this.http.put<UserI>('users', user);
  }

  getPayroll(userRut: string) {
    return this.http.get<Payroll>('payroll?rut=' + userRut);
  }

  savePayroll(payroll: Payroll) {
    return this.http.post<Payroll>('payroll', payroll);
  }
  updatePayroll(payroll: Payroll) {
    return this.http.put<Payroll>('payroll', payroll);
  }
}
