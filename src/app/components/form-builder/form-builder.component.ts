import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormElement } from '../../models/form-element';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Form Builder</h2>
      
      <form [formGroup]="elementForm" (ngSubmit)="addElement()">
        <div class="row">
          <!-- Existing form fields remain the same -->
          <div class="col-md-3 mb-3">
            <label class="form-label">Input Name:</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Input Type:</label>
            <select class="form-select" formControlName="type" (change)="onTypeChange()">
              <option value="text">Text</option>
              <option value="radio">Radio</option>
              <option value="email">Email</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="file">File</option>
              <option value="number">Number</option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Required:</label>
            <select class="form-select" formControlName="required">
              <option [ngValue]="true">True</option>
              <option [ngValue]="false">False</option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label class="form-label">Input Label:</label>
            <input type="text" class="form-control" formControlName="label">
          </div>
        </div>

        <!-- Options for radio/checkbox -->
        @if (showOptions) {
          <div class="row mb-3">
            <div class="col-12">
              <label class="form-label">Options (comma-separated):</label>
              <input type="text" class="form-control" formControlName="options"
                     placeholder="Option1, Option2, Option3">
            </div>
          </div>
        }

        <!-- Option for file input -->
        @if(showFiles) {
        <div class="row mb-3">
          <div class="col-12">
            <label class="form-label">Upload File:</label>
            <input type="file" class="form-control" formControlName="fileData" (change)="handleFileInput($event)"><br>
          </div>
        </div>
        }
        
        <button type="submit" class="btn btn-primary mb-4" [disabled]="!elementForm.valid">
          Add Element
        </button>
      </form>

      @if (formBuilderService.elementCount() > 0) {
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Required</th>
                <th>Label</th>
                <th>Options/File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (element of formElements(); track element.id) {
                <tr>
                  <td>{{ element.name }}</td>
                  <td>{{ element.type }}</td>
                  <td>{{ element.required }}</td>
                  <td>{{ element.label }}</td>
                  <td>
                    @if (element.options) {
                      {{ element.options.join(', ') }}
                    }
                    @if (element.type === 'file') {
                      <!-- <a (click)="downloadFile(element.fileData?.filename)" download><p>{{ element.fileData?.filename }}</p></a> -->
                      <a href={{element.fileData?.filename}} download={{element.fileData?.filename}} class="btn btn-sm btn-primary">Download {{element.fileData?.filename}}</a>
                    }
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm" (click)="removeElement(element.id)">
                      Remove
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="mt-3">
          <button class="btn btn-success me-2" (click)="downloadHTML()">
            Download HTML
          </button>
          <a routerLink="/preview" class="btn btn-info">
            Preview Form
          </a>
        </div>
      }
    </div>
  `
})
export class FormBuilderComponent {
  private fb = inject(FormBuilder);
  formBuilderService = inject(FormBuilderService);

  elementForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]*')]],
    type: ['text', Validators.required],
    required: [false],
    label: ['', Validators.required],
    options: [''],
    fileData: ['']
  });

  formElements = this.formBuilderService.getFormElements();
  showOptions = false;
  showFiles = false;

  onTypeChange() {
    const type = this.elementForm.get('type')?.value;
    this.showOptions = type === 'radio' || type === 'checkbox';
    this.showFiles = type === 'file';
  }

  addElement() {
    if (this.elementForm.valid) {
      const formValue = this.elementForm.value;
      console.log("Form Value", formValue);
      const element: Partial<FormElement> = {
        name: formValue.name,
        type: formValue.type,
        required: formValue.required,
        label: formValue.label
      };

      if (this.showOptions && formValue.options) {
        element.options = formValue.options.split(',').map((opt: string) => opt.trim());
      }
      console.log("This for show files:", this.showFiles, " ", formValue);

      if (this.showFiles && formValue.fileData) {
        console.log(this.showFiles, " ", formValue);
        const fileName = (formValue.fileData).substring(formValue.fileData.lastIndexOf('\\') + 1);
        element.fileData = {filename: fileName, content: "", contentType: ""};
      }

      this.formBuilderService.addFormElement(element as FormElement);
      this.elementForm.reset({
        type: 'text',
        required: false
      });
    }
  }

  async handleFileInput(event: Event, elementId: string = `${Math.floor(Math.random() * 100000)}`) {
    const input = event.target as HTMLInputElement;
    console.log("Input:", input);
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          filename: file.name,
          content: reader.result as string,
          contentType: file.type
        };
        this.formBuilderService.updateFileData(file.name, fileData);
      };

      reader.readAsDataURL(file);
    }
    return input;
  }

  async downloadFile(fileName: string | undefined): Promise<void>{
    this.formBuilderService.getFileData(fileName || "");
  }

  removeElement(id: string) {
    this.formBuilderService.removeFormElement(id);
  }

  downloadHTML() {
    const html = this.formBuilderService.generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_page_' + Math.floor(Math.random() * 100000) + '.html';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}