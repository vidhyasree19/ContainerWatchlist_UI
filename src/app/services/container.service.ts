import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CosmosItem {
  containerNumber: string;
  tradeType: string;
  status: string;
  vesselName: string;
  vesselCode: string;
  voyage: string;
  origin: string;
  line: string;
  destination: string;
  sizeType: string;
  fees: string;
  cartAdded?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  private baseUrl = 'http://localhost:5135/api'; // Update the base URL as needed.

  constructor(private http: HttpClient) { }

  // Method to get the headers
  private getHeaders() {
    // Example: Add authorization token (or any other headers)
    const token = localStorage.getItem('jwtToken'); // Replace this with your actual token retrieval method
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // You can add other headers as needed, such as content type
    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }

  // Fetch container details by container number
  getContainerByNumber(containerNumber: string): Observable<CosmosItem> {
    return this.http.get<CosmosItem>(`${this.baseUrl}/cosmosdata/${containerNumber}`, {
      headers: this.getHeaders()  // Pass the headers with the request
    });
  }

  deleteContainerData(containerNumber: string): Observable<any> {
    const url = `${this.baseUrl}/cosmosdata/${containerNumber}`;  // API endpoint to delete a container

    // Make the DELETE request with headers
    return this.http.delete(url, {
      headers: this.getHeaders() ,
      responseType: 'text' as 'json'  // Set response type as 'text'
      // Call your method to get headers
    });
  }


  // Add container to the cart
  addToCart(container: CosmosItem): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, container, {
      headers: this.getHeaders(),  // Pass the headers with the request
      responseType: 'text' as 'json'  // Set response type as 'text'
    });
  }

  // Get all containers in the cart
  getAllContainersInCart(): Observable<CosmosItem[]> {
    return this.http.get<CosmosItem[]>(`${this.baseUrl}/cart/get-all`, {
      headers: this.getHeaders()  // Pass the headers with the request
    });
  }

  // Remove container from cart
  removeFromCart(containerNumber: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/remove/${containerNumber}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json' // Pass the headers with the request
    });
  }

  // Add a new container (not necessarily to the cart initially)
  addContainer(container: CosmosItem): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, container, {
      headers: this.getHeaders()  // Pass the headers with the request
    });
  }

  // Delete a container (will remove it from cart)
  deleteContainer(containerNumber: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/remove/${containerNumber}`, {
      headers: this.getHeaders()  // Pass the headers with the request
    });
  }
}
