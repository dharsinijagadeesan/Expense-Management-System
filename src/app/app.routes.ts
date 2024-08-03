import { Routes } from '@angular/router';
import { LoginComponent } from './expense-manager/login/login.component';
import { DashboardComponent } from './expense-manager/dashboard/dashboard.component';
import { ExpenseComponent } from './expense-manager/expense/expense.component';
import { HistoryComponent } from './expense-manager/history/history.component';
import { IncomeComponent } from './expense-manager/income/income.component';
import { ProfileComponent } from './expense-manager/profile/profile.component';
import { SideNavComponent } from './expense-manager/side-nav/side-nav.component';
import { TodoComponent } from './expense-manager/todo/todo.component';

export const routes: Routes = [
    //{path:'expense-manager',loadChildren:()=> import('./expense-manager/budget-planner.module').then(m=> m.BudgetPlannerModule)}
    {path: '', redirectTo: 'expense-manager/login', pathMatch: 'full'},
    {path:'expense-manager/login',component:LoginComponent},
    {path:'expense-manager/dashboard',component:DashboardComponent},
    {path:'expense-manager/expense',component:ExpenseComponent},
    {path:'expense-manager/history',component:HistoryComponent},
    {path:'expense-manager/income',component:IncomeComponent},
    {path:'expense-manager/profile',component:ProfileComponent},
    {path:'expense-manager/side-nav',component:SideNavComponent},
    {path:'expense-manager/todo',component:TodoComponent}
];
