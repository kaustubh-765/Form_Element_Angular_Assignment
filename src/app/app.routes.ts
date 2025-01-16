import { Routes } from '@angular/router';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';

export const routes: Routes = [
  { path: '', component: FormBuilderComponent },
  { path: 'preview', component: FormPreviewComponent },
  { path: '**', redirectTo: '' }
];