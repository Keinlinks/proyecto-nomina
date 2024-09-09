import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, viewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


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
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  userSelected = false;
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
      rut: '12345678901',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '100',
    },
    {
      id: 2,
      name: 'Jane',
      rut: '12345678902',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '200',
    },
    {
      id: 3,
      name: 'Joe',
      rut: '12345678903',
      dateIn: '2020-01-01',
      dateOut: '2020-12-31',
      afp: '300',
    },
  ];

  selectedUser(user: any) {
    this.tabGroup.selectedIndex = 1;
    this.userSelected = true;
  }
}
