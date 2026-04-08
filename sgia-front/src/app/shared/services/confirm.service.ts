import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private dialog = inject(MatDialog);

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      resolve(confirmed);
    });
  }
}
