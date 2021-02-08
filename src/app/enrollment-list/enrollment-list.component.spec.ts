import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { EnrollmentListComponent } from './enrollment-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiServiceService } from '../api-service.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { trigger, state } from '@angular/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
// import { By } from 'protractor';

describe('EnrollmentListComponent', () => {
  let component: EnrollmentListComponent;
  let fixture: ComponentFixture<EnrollmentListComponent>;
  const testEnrollee = {id: '1', name: 'name', active: false, dateOfBirth: '1928-12-15'};
  const apiService = jasmine.createSpyObj('ApiServiceService', ['fetchAllEnrollees', 'updateEnrollee']);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        NoopAnimationsModule
       ],
       providers: [{ provide: ApiServiceService, useValue: apiService}],
       declarations: [ EnrollmentListComponent ],
    }).overrideComponent(EnrollmentListComponent, {
      set: {
        animations: [trigger('detailExpand', [])]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentListComponent);
    component = fixture.componentInstance;
    const apiServiceSpy = apiService.fetchAllEnrollees.and.returnValue(of([testEnrollee]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display the enrollee', () => {
    const apiServiceSpy = apiService.fetchAllEnrollees.and.returnValue(of([testEnrollee]));

    fixture.detectChanges();
    expect(component.selectedElement).toBeFalsy();

    const enrollmentListDebug = fixture.debugElement;
    const enrollmentListElement: HTMLElement = enrollmentListDebug.nativeElement;


    expect(enrollmentListElement.querySelector('tbody tr td.mat-column-id').textContent.trim())
      .toBe(testEnrollee.id);
    expect(enrollmentListElement.querySelector('tbody tr td.mat-column-name').textContent.trim())
      .toBe(testEnrollee.name);
    expect(enrollmentListElement.querySelector('tbody tr td.mat-column-active').textContent.trim())
      .toBe(testEnrollee.active + '');

    // since we also have the edit icon, that text is returned here
    expect(enrollmentListElement.querySelector('tbody tr td.mat-column-dateOfBirth').textContent.trim())
      .toBe(testEnrollee.dateOfBirth + ' edit');

  });

  it('should expand the row on click and make it editable', () => {
    const apiServiceSpy = apiService.fetchAllEnrollees.and.returnValue(of([testEnrollee]));

    fixture.detectChanges();
    expect(component.selectedElement).toBeFalsy();

    const enrollmentListDebug = fixture.debugElement;

    const rowEl: DebugElement = fixture.debugElement.query(By.css('.elementRow'));
    rowEl.triggerEventHandler('click', null);

    // component.toggleRow(testEnrollee);
    fixture.detectChanges();
    expect(component.selectedElement).toEqual(testEnrollee);

    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toEqual('name');
      expect(fixture.debugElement.query(By.css('mat-checkbox')).nativeElement.checked).toBeFalsy();
    });

  });

  it('should expand the row on click and make it editable', () => {
    const apiServiceSpy = apiService.fetchAllEnrollees.and.returnValue(of([testEnrollee]));

    fixture.detectChanges();
    expect(component.selectedElement).toBeFalsy();

    const enrollmentListDebug = fixture.debugElement;

    const rowEl: DebugElement = fixture.debugElement.query(By.css('.elementRow'));
    rowEl.triggerEventHandler('click', null);

    // component.toggleRow(testEnrollee);
    fixture.detectChanges();
    expect(component.selectedElement).toEqual(testEnrollee);

    const updated = {id: '1', name: 'New Name', active: false, dateOfBirth: '1928-12-15'};
    const spy = apiService.updateEnrollee.and.returnValue(of(updated));
    component.selectedElement.name = 'New Name';

    fixture.debugElement.query(By.css('.mat-raised-button')).triggerEventHandler('click', null);

    expect(apiService.updateEnrollee).toHaveBeenCalledOnceWith(updated);

  });

});
