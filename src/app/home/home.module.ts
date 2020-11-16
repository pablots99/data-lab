import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from 'src/app/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class HomeModule {}
