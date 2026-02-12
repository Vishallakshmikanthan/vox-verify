import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="upload-card"
      (dragover)="onDragOver($event)" 
      (dragleave)="onDragLeave($event)" 
      (drop)="onDrop($event)"
      [class.drag-active]="isDragging"
    >
      <div class="upload-content">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <h3>Upload Audio File</h3>
        <p>Drag & drop or click to browse</p>
        <p class="crypto-subtext">Supports MP3, WAV (Max 5MB)</p>
        
        <input 
          type="file" 
          #fileInput 
          (change)="onFileSelected($event)" 
          accept=".mp3,.wav" 
          hidden
        >
        <button class="btn btn-primary" (click)="fileInput.click()">Select File</button>
      </div>
    </div>
  `,
    styles: [`
    .upload-card {
      background: var(--color-surface);
      border: 2px dashed var(--color-border);
      border-radius: 12px;
      padding: 48px;
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover, &.drag-active {
        border-color: var(--color-accent);
        background-color: rgba(37, 99, 235, 0.05);
      }
    }

    .icon-container {
      color: var(--color-text-muted);
      margin-bottom: 16px;
    }

    h3 {
      margin-bottom: 8px;
      color: var(--color-text);
    }

    p {
      color: var(--color-text-muted);
      margin-bottom: 24px;
    }

    .crypto-subtext {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .btn {
      position: relative;
      z-index: 2;
    }
  `]
})
export class FileUploadComponent {
    @Output() fileSelected = new EventEmitter<{ file: File, base64: string }>();
    isDragging = false;

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            this.processFile(event.dataTransfer.files[0]);
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    private processFile(file: File) {
        if (file.type !== 'audio/mpeg' && file.type !== 'audio/wav' && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav')) {
            alert('Only MP3 and WAV files are allowed.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            this.fileSelected.emit({ file, base64: base64String });
        };
        reader.readAsDataURL(file);
    }
}
