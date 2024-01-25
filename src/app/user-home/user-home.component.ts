import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/Router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.css"],
})
export class UserHomeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  bus = null;
  notFound = null;
  found = false;
  userId = null;
  user = null;

  arrivalBusstops: string[] = [];
  departureBusstops: string[] = [];

  /* bus search form */
  searchForm = this.formBuilder.group({
    arrivalBusstop: [null, Validators.required],
    departureBusstop: [null, Validators.required],
    date: [null, [Validators.required, this.dateValidator]],
  });

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");

    if (this.userId == null) {
      this.router.navigate(["/error", "not logged in, login to continue"]);
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

      // Fetch arrival and departure bus stops
      this.userService.getDistinctArrivalBusstops().subscribe(
        (data) => {
          this.arrivalBusstops = data;
        },
        (error) => {
          console.error("Error fetching arrival bus stops", error);
        }
      );

      this.userService.getDistinctDepartureBusstops().subscribe(
        (data) => {
          this.departureBusstops = data;
        },
        (error) => {
          console.error("Error fetching departure bus stops", error);
        }
      );
    }
  }

  search() {
    console.log(this.searchForm.get("date").value);
    this.userService
      .searchBus(
        this.searchForm.get("departureBusstop").value,
        this.searchForm.get("arrivalBusstop").value,
        this.searchForm.get("date").value
      )
      .subscribe(
        (data) => {
          this.bus = data;
          console.log(this.bus);
          if (this.bus) {
            this.notFound = null;
            this.found = true;
          } else {
            this.notFound = "no bus found";
            this.found = false;
          }
        },
        (error) => {
          this.notFound = "no bus found";
          this.found = false;
        }
      );
  }

  dateValidator(control: AbstractControl) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();

    if (inputDate < currentDate) {
      return { dateError: true };
    }
    return null;
  }

  logout() {
    localStorage.removeItem("userId");
    this.router.navigate(["/userLogin"]);
  }

  getBookings() {
    this.router.navigate(["/getBookingByUser", this.userId]);
  }

  addPassengers() {
    this.router.navigate(["/addPassengers", this.bus.busNumber]);
  }
}
