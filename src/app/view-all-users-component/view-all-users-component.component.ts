import { Component, OnInit, NgZone } from '@angular/core';
import { AdminService } from "../services/admin.service";
import { Router } from "@angular/Router";


@Component({
  selector: 'app-view-all-users-component',
  templateUrl: './view-all-users-component.component.html',
  styleUrls: ['./view-all-users-component.component.css'],
})
export class ViewAllUsersComponentComponent implements OnInit {
  data:any[]=[]
  adminId = null;

  constructor(private adminService: AdminService, private router: Router, private ngZone: NgZone) { }

  ngOnInit()  {
    this.adminId = localStorage.getItem("adminId");
    if (this.adminId == null) {
      this.router.navigate(["/error", "login to continue"]);
    } else {
      this.adminService.viewAllUsers().subscribe(
        (data) => {
          this.data = data;
        },
         (error) => {
           this.router.navigate(["/error", "some error occured"]);
         }
      );
    }
  }

  loadUsers() {
    this.adminService.viewAllUsers().subscribe(
      response => {
        this.data = response;
      },
      error => {
        console.error(error);
      }
    );}

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to remove this account?')) {
      this.adminService.deleteUser(userId).subscribe(
        response => {
          // After successful deletion, reload the user list
          this.loadUsers();
          // Manually trigger change detection using NgZone
          this.ngZone.run(() => {});
        },
        error => {
          console.error(error);
        }
      );
    }

  }}
