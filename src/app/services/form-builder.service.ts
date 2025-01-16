import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormField } from '../models/form-element';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private formFields = new BehaviorSubject<FormField[]>([]);
  formFields$ = this.formFields.asObservable();

  constructor(private router: Router) {}

  addField(field: FormField) {
    if (field.options && typeof field.options === 'string') {
      field.options = (field.options as string).split(',').map(opt => opt.trim());
    }
    const currentFields = this.formFields.getValue();
    this.formFields.next([...currentFields, field]);
    console.log("FormField", this.formFields.getValue())
  }

  private getStyles(): string {
    return `
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        background-color: #f5f5f5;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
      }

      form {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .form-group {
        margin-bottom: 1.5rem;
        padding: 0.5rem;
        transition: all 0.3s ease;
      }

      .form-group:hover {
        background: #f8f9fa;
        border-radius: 5px;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
        font-size: 0.95rem;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: #4A90E2;
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
      }

      select.form-control {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
      }

      .form-control-file {
        padding: 0.5rem;
        background: #f8f9fa;
      }

      .form-check {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }

      .form-check:hover {
        background-color: #f8f9fa;
      }

      .form-check-input {
        margin-right: 0.75rem;
        width: 1.1em;
        height: 1.1em;
        cursor: pointer;
      }

      .form-check-input[type="radio"] {
        border-radius: 50%;
      }

      .form-check-label {
        margin-bottom: 0;
        cursor: pointer;
        color: #444;
      }

      button[type="submit"] {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        color: white;
        background-color: #4A90E2;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      button[type="submit"]:hover {
        background-color: #357ABD;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      button[type="submit"]:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: 768px) {
        form {
          margin: 1rem;
          padding: 1rem;
        }
      }

      /* Custom styles for specific input types */
      input[type="email"]:valid,
      input[type="number"]:valid {
        border-color: #28a745;
      }

      input[type="email"]:invalid,
      input[type="number"]:invalid {
        border-color: #dc3545;
      }

      /* Custom checkbox and radio styles */
      input[type="checkbox"],
      input[type="radio"] {
        accent-color: #4A90E2;
      }
    </style>`;
  }

  generateFormHtml(): string {
    const fields = this.formFields.getValue();
    const isPreviewRoute = this.router.url.includes('preview');
    let html = '<!DOCTYPE html>\n<html>\n<head>\n';
    html += '<meta charset="UTF-8">\n';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += this.getStyles();
    html += '</head>\n<body>\n';
    html += '<form>\n';
    
    fields.forEach(field => {
      html += `  <div class="form-group">\n`;
      html += `    <label for="${field.name}">${field.label}</label>\n`;
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'file':
          html += `    <input type="${field.type}" id="${field.name}" name="${field.name}"${field.required ? ' required' : ''} class="form-control">\n`;
          break;
        case 'checkbox':
          if (field.options && field.options.length > 0) {
            field.options.forEach((option, index) => {
              html += `    <div class="form-check">\n`;
              html += `      <input type="checkbox" id="${field.name}_${index}" name="${field.name}" value="${option}"${field.required ? ' required' : ''} class="form-check-input">\n`;
              html += `      <label class="form-check-label" for="${field.name}_${index}">${option}</label>\n`;
              html += `    </div>\n`;
            });
          }
          break;
        case 'radio':
          if (field.options && field.options.length > 0) {
            field.options.forEach((option, index) => {
              html += `    <div class="form-check">\n`;
              html += `      <input type="radio" id="${field.name}_${index}" name="${field.name}" value="${option}"${field.required ? ' required' : ''} class="form-check-input">\n`;
              html += `      <label class="form-check-label" for="${field.name}_${index}">${option}</label>\n`;
              html += `    </div>\n`;
            });
          }
          break;
        case 'dropdown':
          html += `    <select id="${field.name}" name="${field.name}"${field.required ? ' required' : ''} class="form-control">\n`;
          html += `      <option value="">Select an option</option>\n`;
          if (field.options && field.options.length > 0) {
            field.options.forEach(option => {
              html += `      <option value="${option}">${option}</option>\n`;
            });
          }
          html += `    </select>\n`;
          break;
      }
      
      html += `  </div>\n`;
    });
    
    html += `  <button type="submit" ${isPreviewRoute ? 'disabled' : ''} 
      style="${isPreviewRoute ? 'opacity: 0.7; cursor: not-allowed;' : 'cursor: pointer;'}"
    >Submit${isPreviewRoute ? ' (Preview Mode)' : ''}</button>\n`;

    html += '</form>\n';
    html += '</body>\n</html>';
    
    return html;
  }

}
