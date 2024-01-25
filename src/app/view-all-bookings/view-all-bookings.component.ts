import { Component, NgZone } from "@angular/core";
import { AdminService } from "../services/admin.service";
import { ActivatedRoute, Router } from "@angular/Router";

@Component({
  selector: "app-view-all-bookings",
  templateUrl: "./view-all-bookings.component.html",
  styleUrls: ["./view-all-bookings.component.css"],
})
export class ViewAllBookingsComponent {
  userId: string = "";
  bookings: any[] = [];
  noBookingsFound: boolean = false;

  constructor(
    private adminService: AdminService,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  fetchBookings() {
    this.adminService.getBookingsByUser(this.userId).subscribe(
      (data) => {
        this.bookings = data;
        this.noBookingsFound = this.bookings.length === 0;
        console.log(data); // Check the data in the console
      },
      (error) => {
        alert("Booking not found for this user");

        console.error("Error fetching data:", error);
      }
    );
  }

  deleteBooking(bookingId: number, userId: any) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      this.adminService.deleteBooking(bookingId, userId).subscribe(
        (response) => {
          // After successful deletion, reload the booking list
          this.fetchBookings();
          // Manually trigger change detection using NgZone
          this.ngZone.run(() => {});
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
