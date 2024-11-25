import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:5001/api/payment';
  private url = 'http://localhost:5135/api' // Backend API URL

  constructor(private http: HttpClient) { }

  // Update this method to accept an object with Id, Fees, and ContainerNumber
  initiatePayment(paymentRequest: { Id: string; Fees: number; ContainerNumber: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate`, paymentRequest);
  }
  updatePaymentStatus(requestId: string, status: string): Observable<any> {
    const payload = { status };  // Only send the status in the body
    return this.http.post(`${this.apiUrl}/update-status/${requestId}`, payload); // Pass the requestId in the URL
  }
  updateContainerFeesToZero(containerNumber: string): Observable<any> {
    const payload = { fees: 0 }; // Explicitly define the fee as 0
    return this.http.put(`${this.url}/cosmosdata/update-fees/${containerNumber}`, payload, {
      responseType: 'text' as 'json' // Pass the headers with the request
    });
  }



}
