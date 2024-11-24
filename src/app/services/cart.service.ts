import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CosmosItem } from '../models/cosmosItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5135/api/cart'; // URL of your API

  constructor(private http: HttpClient) {}

  // Add container to cart
  addContainerToCart(containerItem: CosmosItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, containerItem);
  }

  // Get all containers in the cart
  getAllContainersInCart(): Observable<CosmosItem[]> {
    return this.http.get<CosmosItem[]>(this.apiUrl);
  }

  // Remove container from cart
  removeContainerFromCart(containerNumber: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${containerNumber}`);
  }

  // Remove duplicates from the cart
  removeDuplicateContainers(): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-duplicates`, {});
  }
}
