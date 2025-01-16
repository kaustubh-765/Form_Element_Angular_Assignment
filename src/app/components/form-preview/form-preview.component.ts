import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilderService } from '../../services/form-builder.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-generated-form',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.css',
})
export class FormPreviewComponent {
  sanitizedHtml: SafeHtml = '';

  constructor(
    private formBuilderService: FormBuilderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const html = this.formBuilderService.generateFormHtml();
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}