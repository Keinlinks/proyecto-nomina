export interface Payroll {
  id?: string;
  rut: string;
  salary_per_day: number;
  day_worked: number;
  extra_hours: number;
  extra_price_per_hour: number;
  bonus: number;
  afp: string;
  health_system: string;
  afp_tax: number;
  health_system_tax: number;
  rent_tax: number;
  imponible_salary: number;
  imponible_rent: number;
  liquid_salary:number;
}
