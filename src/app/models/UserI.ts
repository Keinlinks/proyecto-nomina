export interface UserI {
  id?: string;
  name: string;
  rut: string;
  birth_date: Date;
  salary_per_day: number;
  afp: string;
  health_system: string;
  entry_date: Date;
  exit_date: Date;
  title: string;
  discapacity: boolean;
  pensioned: boolean;
}
