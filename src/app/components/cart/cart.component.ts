import { Component, OnInit } from '@angular/core';
import { ContainerService } from '../../services/container.service';
import { CommonModule } from '@angular/common';

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
  cartAdded?: boolean;
}

@Component({
  selector: 'app-view-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone:true,
  imports:[CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CosmosItem[] = [];

  constructor(private containerService: ContainerService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.containerService.getAllContainersInCart().subscribe(
      (items) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error loading cart items', error);
      }
    );
  }

  removeFromCart(container: CosmosItem) {
    this.containerService.removeFromCart(container.containerNumber).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.containerNumber !== container.containerNumber);
      },
      (error) => {
        console.error('Error removing container from cart', error);
      }
    );
  }
}
