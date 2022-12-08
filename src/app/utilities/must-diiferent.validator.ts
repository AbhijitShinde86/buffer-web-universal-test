import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustDiiferent(controlName: string, NotMatchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const notMatchingControl = formGroup.controls[NotMatchingControlName];

        if (notMatchingControl.errors && !notMatchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value === notMatchingControl.value) {
            notMatchingControl.setErrors({ mustDifferent: true });
        } else {
            notMatchingControl.setErrors(null);
        }
    }
}
