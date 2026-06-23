import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard · Cheap Accountant',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'accounts',
    title: 'Accounts · Cheap Accountant',
    loadComponent: () => import('./features/accounts/accounts').then((m) => m.Accounts),
  },
  {
    path: 'journal',
    title: 'Journal · Cheap Accountant',
    loadComponent: () => import('./features/journal/journal').then((m) => m.Journal),
  },
  {
    path: 'ledger',
    title: 'Ledger · Cheap Accountant',
    loadComponent: () => import('./features/ledger/ledger').then((m) => m.Ledger),
  },
  {
    path: 'ledger/:accountId',
    title: 'Ledger · Cheap Accountant',
    loadComponent: () => import('./features/ledger/ledger').then((m) => m.Ledger),
  },
  { path: '**', redirectTo: 'dashboard' },
];
