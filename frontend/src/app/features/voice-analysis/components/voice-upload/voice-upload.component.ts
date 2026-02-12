import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService, AnalysisResponse } from '../../../../core/services/analysis.service';
import { ResultsComponent } from '../../../dashboard/components/results/results.component';

@Component({
    selector: 'app-voice-upload',
    standalone: true,
    imports: [CommonModule, FormsModule, ResultsComponent],
    templateUrl: './voice-upload.component.html',
    styleUrl: './voice-upload.component.scss'
})
export class VoiceUploadComponent {
    // Input fields
    languages = ['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'];
    selectedLanguage = 'English';
    selectedFile: File | null = null;

    // State
    loading = false;
    error = '';
    result: AnalysisResponse | null = null;
    isDragging = false;

    constructor(private analysisService: AnalysisService) { }

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

    processFile(file: File) {
        this.error = '';
        this.result = null;

        // Validate type
        const isMp3 = file.name.toLowerCase().endsWith('.mp3');
        const isWav = file.name.toLowerCase().endsWith('.wav');

        if (!isMp3 && !isWav) {
            this.error = 'Invalid file type. Only MP3 and WAV are allowed.';
            return;
        }

        // Validate size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.error = 'File size exceeds 10MB limit.';
            return;
        }

        this.selectedFile = file;
    }

    analyze() {
        if (!this.selectedFile) return;

        this.loading = true;
        this.error = '';
        this.result = null;

        const format = this.selectedFile.name.toLowerCase().endsWith('.wav') ? 'wav' : 'mp3';

        this.analysisService.analyzeFile(
            this.selectedFile,
            this.selectedLanguage,
            format
        ).subscribe({
            next: (res) => {
                this.result = res;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.detail || 'Analysis failed. Please try again.';
                this.loading = false;
            }
        });
    }

    reset() {
        this.result = null;
        this.selectedFile = null;
        this.error = '';
    }
}
```
