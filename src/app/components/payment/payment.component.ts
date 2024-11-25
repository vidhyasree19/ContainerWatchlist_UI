import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainerService } from '../../services/container.service'; // Import the container service
import { PaymentService } from '../../services/paymentservice.service'; // Service for Payment Integration
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaymentSuccessComponent implements OnInit {
  paymentSuccess: boolean = false;
  successMessage: string = "Your payment was successful!";
  isProcessing: boolean = false;
  cardDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };
  requestId: string | null = null; // Ensure this is initialized as null
  containerNumbers: string[] = []; // Array to hold container numbers

  constructor(
    private router: Router,
    private containerService: ContainerService,
    private paymentService: PaymentService,
    private route: ActivatedRoute // Inject ActivatedRoute to get query params
  ) {}

  ngOnInit() {
    // Check if requestId is passed via query parameters
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
      console.log('Request ID:', this.requestId); // Debugging: make sure requestId is populated
    });

    // Fetch all container numbers associated with the cart or session
    this.containerService.getAllContainersInCart().subscribe(
      (containers) => {
        this.containerNumbers = containers.map(container => container.containerNumber); // Collect container numbers
        console.log('Container Numbers:', this.containerNumbers); // Log container numbers
      },
      (error) => {
        console.error('Error fetching containers:', error);
      }
    );
  }

  // Custom method to handle payment form submission
  onPaymentSubmit() {
    console.log('Form submitted');
    
    // Ensure necessary fields are available
    if (
      this.containerNumbers.length > 0 &&
      this.cardDetails.cardNumber &&
      this.cardDetails.expiryDate &&
      this.cardDetails.cvv
    ) {
      this.isProcessing = true;
      
      // Validate the form fields
      if (!this.isValidCardNumber(this.cardDetails.cardNumber)) {
        console.log('Invalid card number');
        this.isProcessing = false;
        return;
      }
      if (!this.isValidExpiryDate(this.cardDetails.expiryDate)) {
        console.log('Invalid expiry date');
        this.isProcessing = false;
        return;
      }
      if (!this.isValidCVV(this.cardDetails.cvv)) {
        console.log('Invalid CVV');
        this.isProcessing = false;
        return;
      }
    
      // Proceed with the payment
      this.paymentService.updatePaymentStatus(this.requestId || '', 'Paid').subscribe(
        (response) => {
          console.log('Payment status updated:', response);
          this.paymentSuccess = true;
          this.successMessage = 'Your payment was successful!';
          this.isProcessing = false;
          
          // After payment is successful, update the fees in Cosmos DB to 0
          this.updateFeesAndRemoveContainers();
        },
        (error) => {
          console.error('Error updating payment status', error);
          this.isProcessing = false;
          this.successMessage = 'Failed to process payment.';
        }
      );
    } else {
      console.log('Invalid form data or missing containers');
    }
  }

  // Remove items from the cart after payment and reset fees to zero
  updateFeesAndRemoveContainers() {
    this.isProcessing = true;
    this.containerNumbers.forEach((containerNumber) => {
      // Update the container fees to 0
      this.paymentService.updateContainerFeesToZero(containerNumber).subscribe(
        (updateResponse) => {
          console.log(`Container ${containerNumber} fees updated to 0:`, updateResponse);
          // Remove the container from the cart
          this.containerService.removeFromCart(containerNumber).subscribe(
            (response) => {
              console.log(`Container ${containerNumber} removed from cart.`);
            },
            (error) => {
              console.error(`Error removing container ${containerNumber}:`, error);
            }
          );
        },
        (error) => {
          console.error(`Error updating fees for container ${containerNumber}:`, error);
        }
      );
    });

    // After processing, navigate to the success page
    this.isProcessing = false;
    this.router.navigate(['/containers']);
  }

  // Go to the homepage
  goToHomepage() {
    this.router.navigate(['/containers']);
  }

  // Custom validation methods for card details
  isValidCardNumber(cardNumber: string): boolean {
    const cardNumberPattern = /^\d{16}$/; // 16 digits card number
    return cardNumberPattern.test(cardNumber);
  }

  isValidExpiryDate(expiryDate: string): boolean {
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    return expiryDatePattern.test(expiryDate);
  }

  isValidCVV(cvv: string): boolean {
    const cvvPattern = /^\d{3}$/; // 3 digits CVV
    return cvvPattern.test(cvv);
  }
}
