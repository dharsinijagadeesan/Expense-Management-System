import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ExpenseService } from './expense.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, HttpClientModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [ExpenseService]
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  selectedMonth: string;
  expenses: { month: string, expenseType: string, expenseAmount: number }[] = [];
  monthSelected: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private expenseService: ExpenseService, private snackBar: MatSnackBar) {
    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required]
    });
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      (data: any[]) => {
        this.expenses = data;
      },
      error => {
        console.error('Error fetching expenses', error);
      }
    );
  }

  onSubmitExpense() {
    if (this.expenseForm.valid) {
      const newExpense = this.expenseForm.value;
      this.getFilteredExpenses().push(newExpense);
      this.expenses.push({ month: this.selectedMonth, ...newExpense });
      this.expenseForm.reset();
    }
  }

  onChangeExpense(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  getFilteredExpenses() {
    return this.expenses.filter(expense => expense.month === this.selectedMonth);
  }

  calculateTotalExpense(month: string): number {
    return this.expenses
      .filter(expense => expense.month === month)
      .reduce((acc, curr) => acc + curr.expenseAmount, 0);
  }

  deleteExpense(index: number) {
    const filteredExpenses = this.getFilteredExpenses();
    const expenseToDelete = filteredExpenses[index];
    const expenseIndex = this.expenses.indexOf(expenseToDelete);
    this.expenses.splice(expenseIndex, 1);
  }

  saveForm() {
    this.expenseService.saveExpenses(this.expenses).subscribe(
      response => {
        console.log('Expenses saved successfully', response);
        this.snackBar.open('Expenses Saved Successfully!', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error saving expenses', error);
        this.snackBar.open('Error saving expenses!', 'Close', { duration: 3000 });
      }
    );
  }

  onBack() {
    this.router.navigate(['/expense-manager/dashboard']);
  }
}
