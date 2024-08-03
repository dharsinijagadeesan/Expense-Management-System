import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpenseService } from '../expense/expense.service';  // Import the ExpenseService
import { IncomeService } from '../income/income.service';    // Import the IncomeService
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, SideNavComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ExpenseService, IncomeService]    // Provide the IncomeService
})
export class DashboardComponent implements OnInit {
  // Income
  lastMonthsIncome: { month: string, amount: string }[] = [];
  currentMonthIncome: string = '';

  // Expense
  lastMonthsExpense: { month: string, amount: string }[] = [];
  currentMonthExpense: string = '';

  // Todo Transactions
  todoTransactions = [
    { description: 'Pay electricity bill' },
    { description: 'Submit monthly report' },
    { description: 'Buy groceries' },
    { description: 'Call insurance company' }
  ];

  // Total
  totalCurrentMonthIncome = 0;
  totalCurrentMonthExpense = 0;

  constructor(
    public router: Router,
    private expenseService: ExpenseService,  // Inject the ExpenseService
    private incomeService: IncomeService,    // Inject the IncomeService
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
    this.loadIncomes();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      (data: any[]) => {
        const expenseMap: { [key: string]: number } = {};

        data.forEach(expense => {
          if (!expenseMap[expense.month]) {
            expenseMap[expense.month] = 0;
          }
          expenseMap[expense.month] += expense.expenseAmount;
        });

        this.lastMonthsExpense = Object.entries(expenseMap).map(([month, amount]) => ({
          month,
          amount: `$${amount}`
        }));

        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        this.currentMonthExpense = this.lastMonthsExpense.find(e => e.month === currentMonth)?.amount || '$0';
        this.totalCurrentMonthExpense = parseInt(this.currentMonthExpense.replace('$', ''), 10);
      },
      error => {
        console.error('Error fetching expenses', error);
        this.snackBar.open('Error fetching expenses!', 'Close', { duration: 3000 });
      }
    );
  }

  loadIncomes() {
    this.incomeService.getIncomes().subscribe(
      (data: any[]) => {
        const incomeMap: { [key: string]: number } = {};

        data.forEach(income => {
          if (!incomeMap[income.month]) {
            incomeMap[income.month] = 0;
          }
          incomeMap[income.month] += income.amount;
        });

        this.lastMonthsIncome = Object.entries(incomeMap).map(([month, amount]) => ({
          month,
          amount: `$${amount}`
        }));

        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        this.currentMonthIncome = this.lastMonthsIncome.find(i => i.month === currentMonth)?.amount || '$0';
        this.totalCurrentMonthIncome = parseInt(this.currentMonthIncome.replace('$', ''), 10);
      },
      error => {
        console.error('Error fetching incomes', error);
        this.snackBar.open('Error fetching incomes!', 'Close', { duration: 3000 });
      }
    );
  }

  onIncome() {
    this.router.navigate(['/expense-manager/income']);
  }

  onExpense() {
    this.router.navigate(['/expense-manager/expense']);
  }

  onTodo() {
    this.router.navigate(['/expense-manager/todo']);
  }

  // Calculate Total
  get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
  }
}
