import { Component, OnInit } from '@angular/core';
import { Enrollee } from '../enrollee';
import { ApiServiceService } from '../api-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-enrollment-list' ,
  templateUrl: './enrollment-list.component.html' ,
  styleUrls: ['./enrollment-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EnrollmentListComponent implements OnInit {

  dataSource = new MatTableDataSource<Enrollee>();
  displayedColumns: string[] = ['id', 'name', 'active', 'dateOfBirth'];

  selectedElement: Enrollee | null;
  selectedIndex = -1;

  constructor(public snackbar: MatSnackBar, private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.refresh();
  }

  toggleRow(selected: Enrollee): void {
    this.selectedElement = this.isSelected(selected) ? null : selected;
  }

  isSelected(enrollee: Enrollee): boolean {
    return this.selectedElement != null && this.selectedElement.id === enrollee.id;
  }

  refresh(): void {
    this.apiService.fetchAllEnrollees()
      .subscribe(
        (enrollees: Enrollee[]) => this.dataSource.data = enrollees,
        error => {
          this.showSnack(`Failed to fetch, status: ${error.status}, message: ${error.error}`, 'errorSnack');
          this.dataSource.data = [];
        }
      );
  }

  update(enrollee: Enrollee, index: number): void {
    this.apiService.updateEnrollee(this.selectedElement)
      .subscribe(
          (updatedEnrollee: Enrollee) => this.onUpdateSuccess(updatedEnrollee, index),
          (error) => this.onUpdateError(error)
        );
  }

  onUpdateSuccess(enrollee: Enrollee, index: number): void {
    this.showSnack('Update successful', 'successSnack');
    this.dataSource.data[index] = this.selectedElement;
    this.selectedElement = null;

  }

  onUpdateError(error: any): void {
    this.showSnack(`Update failed with error, status: ${error.status}, message: ${error.error}`, 'errorSnack');
    this.refresh();
  }

  cancel(): void {
    this.refresh();
  }

  showSnack(message: string, cssClass: string): void {
    this.snackbar.open(message, '', {
      duration: 40000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [cssClass]
    });
  }
}
