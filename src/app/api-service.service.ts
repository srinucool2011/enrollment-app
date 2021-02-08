import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Enrollee } from './enrollee';

export const API_BASE_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  fetchAllEnrollees(): Observable<Enrollee[]> {
    const url = `${API_BASE_URL}/enrollees`;

    return this.http.get<Enrollee[]>(url);
  }

  updateEnrollee(enrollee: Enrollee): Observable<Enrollee> {
    const url = `${API_BASE_URL}/enrollees/${enrollee.id}`;

    return this.http.put<Enrollee>(url, enrollee);
  }

}
