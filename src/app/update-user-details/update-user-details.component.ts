import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/Router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-update-user-details",
  templateUrl: "./update-user-details.component.html",
  styleUrls: ["./update-user-details.component.css"],
})
export class UpdateUserDetailsComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  userId = null;
  user = null;

  /* ---- update form------ */

  updateForm = this.formBuilder.group(
    {
      userName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern("[6789][0-9]{9}")],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
    },
    { validators: this.passwordValidator }
  );

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    if (this.userId == null) {
      this.router.navigate(["/error", "login to continue"]);
    } else {
      this.userId = parseInt(this.userId);
      this.userService.getUser(this.userId).subscribe(
        (data) => {
          this.user = data;

          // Patch the form with the user data
          this.updateForm.patchValue({
            userName: this.user.userName,
            email: this.user.email,
            phone: this.user.phone,
            password: "", // You may or may not want to prefill the password
            confirmPassword: "", // You may or may not want to prefill the confirmPassword
          });
        },
        (error) => {
          this.router.navigate(["/error", "not logged in, login to continue"]);
        }
      );
    }
  }

  /* ------password validator------- */

  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const pass = control.get("password");
    const cnfm = control.get("confirmPassword");
    if (pass && cnfm && pass.value !== cnfm.value) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  submit() {
    this.updateForm.removeControl("confirmPassword");
    let data = this.updateForm.value;
    data.userId = this.userId;
    this.userService.updateUser(data).subscribe(
      (data) => {
        this.router.navigate(["/userHome"]);
      },
      (error) => {
        this.router.navigate(["/error", "unable to update"]);
      }
    );
  }

  logout() {
    localStorage.removeItem("userId");
    this.router.navigate(["/userLogin"]);
  }
}
