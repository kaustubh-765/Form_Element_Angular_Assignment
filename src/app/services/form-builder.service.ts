import { Injectable, signal, computed } from '@angular/core';
import { FormElement } from '../models/form-element';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private formElements = signal<FormElement[]>([]);
  private readonly STORAGE_KEY = 'formBuilderFiles';
  
  readonly elementCount = computed(() => this.formElements().length);

  constructor() {
    // Initialize storage
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
    }
  }

  getFormElements() {
    return this.formElements;
  }

  addFormElement(element: Omit<FormElement, 'id'>) {
    const newElement = {
      ...element,
      id: crypto.randomUUID()
    };

    console.log("Element:", element);
    
    this.formElements.update(elements => [...elements, newElement]);
    console.log("newElement: ", this.formElements());
  }

  removeFormElement(id: string) {
    // Remove file from storage if exists
    const fileData = this.getFileData(id);
    if (fileData) {
      this.removeFileData(id);
    }

    this.formElements.update(elements => 
      elements.filter(element => element.id !== id)
    );
  }

  updateFileData(elementId: string, fileData: FormElement['fileData']) {
    // Save to localStorage
    const files = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    files[`${fileData?.filename}`] = fileData;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
    // Update signal
    this.formElements.update(elements =>
      elements.map(element =>
        element.id === elementId
          ? { ...element, fileData }
          : element
      )
    );
  }

  getFileData(elementId: string): FormElement['fileData'] | null {
    const files = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return files[elementId] || null;
  }

  removeFileData(elementId: string) {
    const files = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    delete files[elementId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
  }

  generateHTML(): string {
    const elements = this.formElements();
    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Generated Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
`;

    html += `
    <!-- Structure Table -->
    <div class="m-5">
        <h2>Form</h2>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Field Name</th>
                        <th>Input Type</th>
                        <th>Required</th>
                        <th>Label</th>
                        <th>Options/Files</th>
                    </tr>
                </thead>
                <tbody>
`;

    elements.forEach(element => {
      html += `
                    <tr>
                        <td>${element.name}</td>
                        <td>${element.type}</td>
                        <td>${element.required ? 'Yes' : 'No'}</td>
                        <td>${element.label}</td>
                        <td>`;
      
      if (element.options) {
        html += element.options.join(', ');
      }
      
      else if (element.fileData) {
        html += `<a href="${element.fileData.filename}" 
                   download="${element.fileData.filename}" 
                   class="btn btn-sm btn-primary">
                   Download ${element.fileData.filename}
                </a>`;
      }
      else {
        html += '-';
      }
      
      html += `</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    return html;
  }
}