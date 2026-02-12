import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AnalysisService, AnalysisResponse } from '../../core/services/analysis.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    history: AnalysisResponse[] = [];
    total = 0;
    page = 1;
    limit = 10;
    totalPages = 1;

    languages = ['All', 'Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'];
    selectedLanguage = 'All';
    loading = false;

    constructor(
        private authService: AuthService,
        private analysisService: AnalysisService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.loading = true;
        const langInfo = this.selectedLanguage === 'All' ? undefined : this.selectedLanguage;

        this.analysisService.getHistory(this.page, this.limit, langInfo).subscribe({
            next: (res) => {
                this.history = res.items;
                this.total = res.total;
                this.totalPages = res.pages;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    onFilterChange() {
        this.page = 1;
        this.loadHistory();
    }

    nextPage() {
        if (this.page < this.totalPages) {
            this.page++;
            this.loadHistory();
        }
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.loadHistory();
        }
    }

    navigateToAnalysis() {
        this.router.navigate(['/analyze']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
