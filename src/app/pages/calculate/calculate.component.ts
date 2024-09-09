import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent { }
