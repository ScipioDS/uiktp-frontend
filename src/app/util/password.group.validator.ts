import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[passwordGroupValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordGroupValidator, multi: true }]
})
export class PasswordGroupValidator implements Validator {
  validate(group: AbstractControl): ValidationErrors | null {
    const oldPassword = group.get('oldPassword')?.value;
    const newPassword = group.get('newPassword')?.value;

    if (newPassword && !oldPassword) {
      return { oldPasswordRequired: true };
    }

    return null;
  }
}
