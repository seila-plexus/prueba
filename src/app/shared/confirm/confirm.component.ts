import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent implements OnInit {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  title = signal<string>("");
  message = signal<string>("");

  ngOnInit(): void {
    this.title.set(this.data.title);
    this.message.set(this.data.message);
  }
}
