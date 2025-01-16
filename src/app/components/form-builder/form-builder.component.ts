import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent {
  fieldForm: FormGroup;
  formFields$: any;
  showOptionsField = false;

  constructor(
    private fb: FormBuilder,
    private formBuilderService: FormBuilderService,
    private router: Router
  ) {
    this.fieldForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.formFields$ = this.formBuilderService.formFields$;
  }

  private initializeForm(): void {
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false],
      label: ['', Validators.required],
      options: ['']
    });
  }

  onTypeChange() {
    const type = this.fieldForm.get('type')?.value;
    this.showOptionsField = ['radio', 'dropdown', 'checkbox'].includes(type);
    
    if (this.showOptionsField) {
      this.fieldForm.get('options')?.setValidators([Validators.required]);
    } else {
      this.fieldForm.get('options')?.clearValidators();
      this.fieldForm.get('options')?.setValue('');
    }
    this.fieldForm.get('options')?.updateValueAndValidity();
  }

  addField() {
    if (this.fieldForm.valid) {
      const fieldValue = this.fieldForm.value;
      if (fieldValue.options) {
        fieldValue.options = fieldValue.options.split(',').map((opt: string) => opt.trim());
      }
      this.formBuilderService.addField(fieldValue);
      this.fieldForm.reset({
        type: 'text',
        required: false
      });
      this.showOptionsField = false;
    }
  }

  downloadHtml() {
    const html = this.formBuilderService.generateFormHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_page_' + Math.floor(Math.random() * 100000) + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  previewForm() {
    this.router.navigate(['/preview']);
  }
}