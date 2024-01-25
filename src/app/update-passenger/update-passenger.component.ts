import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/Router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-update-passenger",
  templateUrl: "./update-passenger.component.html",
  styleUrls: ["./update-passenger.component.css"],
})
export class UpdatePassengerComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}
  user = null;
  userId = null;
  passengerId = null;

  passengerForm = this.formBuilder.group({
    name: [null, Validators.required],
    age: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
    luggage: [
      null,
      [Validators.required, Validators.min(0), Validators.max(15)],
    ],
  });

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");
    if (this.userId == null) {
      this.router.navigate(["/error", "login to continue"]);
    } else {
      this.userId = parseInt(this.userId);
      this.userService.getUser(this.userId).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          this.router.navigate(["/error", "not logged in, login to continue"]);
        }
      );
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.passengerId = params.get("passengerId");

        if (this.passengerId != null) {
          // Fetch passenger details and prefill the form
          this.userService.getPassengerById(this.passengerId).subscribe(
            (passengerData) => {
              this.passengerForm.patchValue(passengerData);
            },
            (error) => {
              this.router.navigate([
                "/error",
                "unable to fetch passenger details",
              ]);
            }
          );
        }
      });
    }
  }

  logout() {
    localStorage.removeItem("userId");
    this.router.navigate(["/userLogin"]);
  }

  submit() {
    let data = this.passengerForm.value;
    if (this.passengerId == null) {
      this.router.navigate(["/error", "passenger id not provided"]);
    } else {
      data.passengerId = parseInt(this.passengerId);
      this.userService.updatePassenger(data).subscribe(
        (data) => {
          alert("Passenger Got updated");
          this.router.navigate(["/getBookingByUser/:userId"]);
        },
        (error) => {
          this.router.navigate(["/error", "unable to update passenger"]);
        }
      );
    }
  }
}
