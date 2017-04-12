import { Injectable } from '@angular/core';
import { FormGroup }                  from '@angular/forms';

@Injectable()
export class FormHelperService {
  /**
   * Helper function to update an object containing the errors for the FormGroup
   * Currently only supports a FormGroup with a single level (contains no other formGroups)
   * @param {FormGroup} form               [description]
   * @param {Object}    errors             [description]
   * @param {Object}    validationMessages [description]
   */
  public updateFormErrors(
    form: FormGroup,
    errors: {[key: string]: string},
    validationMessages: {[key: string]: {[key: string]: string}}
  ): void {
    if (!form) { return; }

    // Loop through error fields checking for errors
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        errors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (errors.hasOwnProperty(field)) {
              errors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
