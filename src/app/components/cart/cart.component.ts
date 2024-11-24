import { Component, OnInit } from '@angular/core';
import { ContainerService } from '../../services/container.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  fees: string;  // Fees as string to handle currency formatting
  cartAdded?: boolean;
}

@Component({
  selector: 'app-view-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CosmosItem[] = [];  // Holds items in the cart
  isLoading: boolean = true; // Loading flag
  errorMessage: string = ''; // For error handling
  
  constructor(private containerService: ContainerService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load all cart items from the service or local storage
  loadCart() {
    this.containerService.getAllContainersInCart().subscribe(
      (items) => {
        this.cartItems = items;
        this.isLoading = false; // Set loading to false once items are loaded
      },
      (error) => {
        console.error('Error loading cart items', error);
        this.errorMessage = 'Failed to load cart items. Please try again later.';
        this.isLoading = false; // Set loading to false even on error
      }
    );
  }

  // Remove an item from the cart
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

  // Calculate the total fees for all containers in the cart
  getTotalFees(): number {
    return this.cartItems.reduce((total, item) => {
      const fees = parseFloat(item.fees);
      return !isNaN(fees) ? total + fees : total;
    }, 0);
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    console.log('Proceeding to checkout...');
    // Navigate to checkout page or perform checkout logic
    this.router.navigate(['/payment']);
  }
}
