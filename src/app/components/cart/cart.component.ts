import { Component, OnInit } from '@angular/core';
import { ContainerService } from '../../services/container.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/paymentservice.service'; // Service for Payment Integration
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for generating unique requestId
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  fees: string; // This should be a string but will convert to a number for calculation
  cartAdded?: boolean;
}

@Component({
  selector: 'app-view-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
})
export class CartComponent implements OnInit {
  cartItems: CosmosItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';  // For success message when payment is successful

  constructor(
    private containerService: ContainerService,
    private router: Router,
    private paymentService: PaymentService  // Inject payment service
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  // Load cart items
  loadCart() {
    this.containerService.getAllContainersInCart().subscribe(
      (items) => {
        this.cartItems = items;
        console.log("Cart items loaded:", this.cartItems);  // Debugging to check if the items are loaded correctly
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load cart items.';
        this.isLoading = false;
      }
    );
  }

  // Remove item from cart
  removeFromCart(container: CosmosItem) {
    this.containerService.removeFromCart(container.containerNumber).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.containerNumber !== container.containerNumber);
      },
      (error) => {
        this.errorMessage = 'Failed to remove container from cart';
      }
    );
  }

  // Calculate total fees
  getTotalFees(): number {
    const total = this.cartItems.reduce((total, item) => total + parseFloat(item.fees || '0'), 0);
    console.log("Total fees calculated:", total);  // Debugging to check total fees calculation
    return total;
  }

  // Proceed to payment
  proceedToPayment(): void {
    const totalAmount = this.getTotalFees();

    // Generate a unique transaction ID for each payment request
    const uniqueTransactionId = uuidv4();  // Generates a unique ID each time

    // Create the payment request payload with status as "Pending"
    const paymentRequest = {
      Id: uniqueTransactionId,  // Use the generated UUID as the transaction ID
      Fees: totalAmount,        // Total amount
      ContainerNumber: this.cartItems.map(item => item.containerNumber).join(','),  // Concatenate all container numbers
      Status: 'Pending'  // Set status to 'Pending' initially
    };

    console.log("Payment request payload:", paymentRequest);  // Debugging to check the payment request payload

    this.paymentService.initiatePayment(paymentRequest).subscribe(
      (response) => {
        console.log('Payment initiated', response);
        
        // After payment initiation, navigate to the payment success page with requestId as a query parameter
        this.router.navigate(['/payment'], { queryParams: { requestId: uniqueTransactionId } });
      },
      (error) => {
        this.errorMessage = 'Payment initiation failed';
        console.error('Error initiating payment', error);
      }
    );
  }
}
