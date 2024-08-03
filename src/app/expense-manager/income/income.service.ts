import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class IncomeService {
  private incomeUrl = 'http://localhost:3000/incomes';  // URL to the backend server endpoint

  constructor(private http: HttpClient) {}

  getIncomes(): Observable<any[]> {
    return this.http.get<any[]>(this.incomeUrl);
  }

  saveIncomes(incomes: any[]): Observable<any> {
    return this.http.post<any>(this.incomeUrl, { incomes });
  }
}
