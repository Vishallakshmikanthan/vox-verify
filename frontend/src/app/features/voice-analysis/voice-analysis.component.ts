import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisService, AnalysisResponse } from '../../core/services';
import { VoiceUploadComponent } from './components/voice-upload/voice-upload.component';
import { ResultsComponent } from '../dashboard/components/results/results.component';

@Component({
  selector: 'app-voice-analysis',
  standalone: true,
  imports: [CommonModule, VoiceUploadComponent],
  template: `
    <div class="voice-analysis-container">
      <header>
        <h1>Voice Analysis</h1>
        <p>Upload an audio file to detect if it's Human or AI-generated.</p>
      </header>

      <div class="analysis-content">
        <app-voice-upload></app-voice-upload>
      </div>
    </div>
  `,
  styles: [`
    .voice-analysis-container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }
    header {
        text-align: center;
        margin-bottom: 3rem;
        h1 { font-size: 2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
        p { color: var(--text-secondary); }
    }
    .loading-state {
        text-align: center;
        padding: 4rem;
        .spinner {
            border: 3px solid var(--surface-border);
            border-top: 3px solid var(--accent-primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
    }
    .error-banner {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        color: #B91C1C;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        button {
            background: transparent;
            border: 1px solid #B91C1C;
            color: #B91C1C;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            &:hover { background: #fee2e2; }
        }
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class VoiceAnalysisContainerComponent {
  constructor() { }
}
