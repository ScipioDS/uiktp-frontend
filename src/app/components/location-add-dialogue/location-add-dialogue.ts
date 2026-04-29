import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-add-dialogue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './location-add-dialogue.html',
  styleUrl: './location-add-dialogue.css',
})
export class LocationAddDialogue {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LocationAddDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        id: null,           // null → create; pass an id for update
        userId: this.data.userId,
        ...this.form.value,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
