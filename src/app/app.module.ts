import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, ScrollingModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
