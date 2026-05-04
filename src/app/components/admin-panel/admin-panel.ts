import { Component, signal } from '@angular/core';
import { Header } from '../header/header';
import { finalize } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-admin-panel',
  imports: [Header],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  isImporting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private locationService: LocationService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.setFile(input.files[0]);
  }

  setFile(file: File) {
    this.successMessage.set('');
    this.errorMessage.set('');
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      this.errorMessage.set('Please select a valid Excel file (.xlsx or .xls).');
      return;
    }
    this.selectedFile.set(file);
  }

  clearFile(event: MouseEvent) {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  importFile() {
    if (!this.selectedFile()) return;

    this.isImporting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.locationService
      .importExcel(this.selectedFile()!)
      .pipe(finalize(() => this.isImporting.set(false)))
      .subscribe({
        next: (msg) => {
          this.successMessage.set(msg?.trim() || 'Import successful!');
          this.selectedFile.set(null);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message?.trim() || 'Import failed. Please try again.');
        },
      });
  }
}
