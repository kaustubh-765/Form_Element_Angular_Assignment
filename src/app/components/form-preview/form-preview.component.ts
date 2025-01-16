import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Form Preview</h2>
        <a routerLink="/" class="btn btn-primary">Back to Builder</a>
      </div>
      
      <div [innerHTML]="previewHtml"></div>
    </div>
  `,
})
export class FormPreviewComponent {
  private formBuilderService = inject(FormBuilderService);
  previewHtml = this.formBuilderService.generateHTML();
}