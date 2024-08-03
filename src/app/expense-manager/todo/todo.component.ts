import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  selectedMonth: string = '';
  todos: any[] = [];
  monthSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required]
    });

    this.fetchTodos();
  }

  fetchTodos() {
    this.http.get<any[]>('http://localhost:3000/todos').subscribe(
      (data) => {
        this.todos = data;
      },
      (error) => {
        console.error('Error fetching todos', error);
        this.snackBar.open('Error fetching todos!', 'Close', { duration: 3000 });
      }
    );
  }

  onSubmitExpense() {
    if (this.todoForm.valid) {
      const newTodo = { ...this.todoForm.value, id: this.generateId(), selected: false };
      this.http.post('http://localhost:3000/todos', newTodo).subscribe(
        () => {
          this.todos.push(newTodo);
          this.todoForm.reset();
          this.todoForm.patchValue({ month: '', expenseType: '', expenseAmount: '' });
          this.snackBar.open('Todo saved successfully!', 'Close', { duration: 3000 });
        },
        (error) => {
          console.error('Error saving todo', error);
          this.snackBar.open('Error saving todo!', 'Close', { duration: 3000 });
        }
      );
    }
  }

  onChangeExpense(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  getFilteredExpenses() {
    return this.todos.filter(todo => todo.month === this.selectedMonth);
  }

  calculateTotalExpense(month: string): number {
    return this.getFilteredExpenses().reduce((acc, todo) => acc + todo.expenseAmount, 0);
  }

  onSave() {
    this.http.post('http://localhost:3000/todos/save', { todos: this.todos }).subscribe(
      () => {
        this.snackBar.open('Todos saved successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error saving todos', error);
        this.snackBar.open('Error saving todos!', 'Close', { duration: 3000 });
      }
    );
  }

  onBack() {
    this.router.navigate(['/expense-manager/dashboard']);
  }

  toggleSelection(todo: any) {
    todo.selected = !todo.selected;
  }

  deleteTodo(todoId: string) {
    this.http.delete(`http://localhost:3000/todos/${todoId}`).subscribe(
      () => {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
        this.snackBar.open('Todo deleted successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error deleting todo', error);
        this.snackBar.open('Error deleting todo!', 'Close', { duration: 3000 });
      }
    );
  }

  private generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
