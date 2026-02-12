import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisResponse {
    id: number;
    filename: string;
    language?: string;
    classification: 'HUMAN' | 'AI_GENERATED';
    confidence_score: number;
    explanation: string;
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class AnalysisService {
    private apiUrl = 'http://localhost:8000/api/voice';

    constructor(private http: HttpClient) { }

    analyzeAudio(file: File): Observable<AnalysisResponse> {
        // Legacy or if we implement multipart on new endpoint
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze`, formData);
    }

    analyzeFile(file: File, language: string = "Unknown", audioFormat: string = "mp3"): Observable<AnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', language);
        formData.append('audio_format', audioFormat);

        return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze`, formData);
    }

    getHistory(page: number = 1, limit: number = 10, language?: string): Observable<any> {
        let params: any = { page, limit };
        if (language) params.language = language;
        return this.http.get<any>(`${this.apiUrl}/history`, { params });
    }
}
