import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResponse } from '../../../../core/services/analysis.service';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="result" class="result-card" [class.human]="isHuman" [class.ai]="!isHuman">
      <div class="result-header">
        <div class="status-badge" [class.human-badge]="isHuman" [class.ai-badge]="!isHuman">
          {{ isHuman ? 'HUMAN VERIFIED' : 'AI GENERATED' }}
        </div>
        <div class="timestamp">{{ result.created_at | date:'medium' }}</div>
      </div>

      <div class="confidence-section">
        <div class="confidence-label">
          <span>Confidence Score</span>
          <span class="score-value">{{ (result.confidence_score * 100) | number:'1.1-1' }}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" [style.width.%]="result.confidence_score * 100" [class.human-fill]="isHuman" [class.ai-fill]="!isHuman"></div>
        </div>
      </div>

      <div class="explanation">
        <h4>Analysis Report</h4>
        <p>{{ result.explanation }}</p>
      </div>
    </div>
  `,
    styles: [`
    .result-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      border-left: 6px solid transparent;
      margin-top: 24px;
      animation: slideDown 0.4s ease-out;
    }

    .human { border-left-color: var(--color-status-human); }
    .ai { border-left-color: var(--color-status-ai); }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .status-badge {
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
    }

    .human-badge {
      background-color: rgba(5, 150, 105, 0.1);
      color: var(--color-status-human);
    }

    .ai-badge {
      background-color: rgba(220, 38, 38, 0.1);
      color: var(--color-status-ai);
    }

    .timestamp {
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }

    .confidence-section {
      margin-bottom: 24px;
    }

    .confidence-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .progress-bar-bg {
      height: 10px;
      background-color: var(--color-border);
      border-radius: 5px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 1s ease-out;
    }

    .human-fill { background-color: var(--color-status-human); }
    .ai-fill { background-color: var(--color-status-ai); }

    .explanation {
      background-color: var(--color-background);
      padding: 16px;
      border-radius: 8px;

      h4 {
        margin-bottom: 8px;
        font-size: 1rem;
      }
      
      p {
        color: var(--color-text-muted);
        font-size: 0.95rem;
      }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ResultsComponent implements OnChanges {
    @Input() result: AnalysisResponse | null = null;
    isHuman: boolean = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['result'] && this.result) {
            this.isHuman = this.result.classification === 'HUMAN';
        }
    }
}
