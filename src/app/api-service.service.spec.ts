import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { ApiServiceService, API_BASE_URL } from './api-service.service';
import { Enrollee } from './enrollee';

describe('ApiServiceService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: ApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can fetchAllEnrollees', () => {
    const testData: Enrollee[] = [
      {id: '1', name: 'Name 1', active: true, dateOfBirth: '1962-11-3'},
      {id: '2', name: 'Name 2', active: false, dateOfBirth: '1962-11-4'},
    ];

    service.fetchAllEnrollees()
      .subscribe(enrollees => expect(enrollees).toEqual(testData));

    const req = httpTestingController.expectOne(`${API_BASE_URL}/enrollees`);

    expect(req.request.method).toEqual('GET');
    req.flush(testData);

  });

  it('should throw error when fetchAllEnrollees fails', () => {

    service.fetchAllEnrollees()
      .subscribe(
        enrollees => fail('Should have failed'),
        error => {
          expect(error.status).toBe(500);
          expect(error.error).toBe('Internal Server Error');
        }
      );

    const req = httpTestingController.expectOne(`${API_BASE_URL}/enrollees`);

    expect(req.request.method).toEqual('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server error' });

  });

  it('should call the updateEnrollee endpoint to update', () => {
    const testEnrollee: Enrollee = {id: '1', name: 'Name 1', active: true, dateOfBirth: '1962-11-3'};

    service.updateEnrollee(testEnrollee)
      .subscribe(enrollee => expect(enrollee).toEqual(testEnrollee));

    const req = httpTestingController.expectOne(`${API_BASE_URL}/enrollees/1`);

    expect(req.request.method).toEqual('PUT');
    req.flush(testEnrollee);

  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
});
