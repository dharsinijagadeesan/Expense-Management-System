import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TodoService {
  private todoUrl = 'http://localhost:3000/todos';  // URL to the backend server endpoint

  constructor(private http: HttpClient) {}

  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.todoUrl);
  }

  addTodo(todo: any): Observable<any> {
    return this.http.post<any>(this.todoUrl, todo);
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.todoUrl}/${id}`);
  }

  saveTodos(todos: any[]): Observable<any> {
    return this.http.post<any>(this.todoUrl, { todos });
  }
}
