import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from './income.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  providers: [IncomeService]
})
export class IncomeComponent implements OnInit {
  incomeForm!: FormGroup;
  selectedMonth: string;
  incomes: { month: string, source: string, amount: number, investments: string }[] = [];
  monthSelected: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private incomeService: IncomeService, private snackBar: MatSnackBar) {
    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required]
    });
    this.loadIncomes();
  }

  loadIncomes() {
    this.incomeService.getIncomes().subscribe(
      (data: any[]) => {
        this.incomes = data;
      },
      error => {
        console.error('Error fetching incomes', error);
        this.snackBar.open('Error fetching incomes!', 'Close', { duration: 3000 });
      }
    );
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      const newIncome = this.incomeForm.value;
      this.incomes.push({ month: this.selectedMonth, ...newIncome });
      this.incomeForm.reset();
    }
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  getFilteredIncomes() {
    return this.incomes.filter(income => income.month === this.selectedMonth);
  }

  calculateTotalIncome(month: string): number {
    return this.incomes
      .filter(income => income.month === month)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }

  deleteIncome(index: number) {
    const filteredIncomes = this.getFilteredIncomes();
    const incomeToDelete = filteredIncomes[index];
    const incomeIndex = this.incomes.indexOf(incomeToDelete);
    this.incomes.splice(incomeIndex, 1);
  }

  saveForm() {
    this.incomeService.saveIncomes(this.incomes).subscribe(
      response => {
        console.log('Incomes saved successfully', response);
        this.snackBar.open('Incomes Saved Successfully!', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error saving incomes', error);
        this.snackBar.open('Error saving incomes!', 'Close', { duration: 3000 });
      }
    );
  }

  onBack() {
    this.router.navigate(['/expense-manager/dashboard']);
  }
}
