import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContainerService } from '../../services/container.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class PaymentSuccessComponent {
  cardDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  isProcessing: boolean = false;
  paymentSuccess: boolean = false;
  successMessage: string = "Your payment was successful!";

  constructor(private router: Router, private containerService: ContainerService) {}

  // Custom validator for card number
  cardNumberValidator(control: any) {
    const cardNumber = control.value;
    // Validate card number: must be exactly 16 digits
    if (!/^\d{16}$/.test(cardNumber)) {
      return { invalidCardNumber: 'Card number must be exactly 16 digits long.' };
    }
    return null;
  }

  // Custom validator for expiry date
  expiryDateValidator(control: any) {
    const expiryDate = control.value;
    
    // Check if the expiry date is in the format MM/YY
    const today = new Date();
    const [month, year] = expiryDate.split('/').map((part: string) => part.trim());
  
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return { invalidExpiryDate: 'Expiry date must be in the format MM/YY.' };
    }
  
    const expiryMonth = parseInt(month, 10);  // Ensure month is treated as a number
    const expiryYear = parseInt(year, 10);    // Ensure year is treated as a number
  
    // Validate month (must be between 1 and 12)
    if (expiryMonth < 1 || expiryMonth > 12) {
      return { invalidExpiryDate: 'Invalid month in expiry date.' };
    }
  
    // Create a valid expiry date (20YY-MM-01 format, using the first day of the month)
    const expiryDateObj = new Date(`20${year}-${expiryMonth}-01`);
  
    // Ensure the expiry date is in the future
    if (expiryDateObj <= today) {
      return { invalidExpiryDate: 'Expiry date must be in the future.' };
    }
  
    return null;
  }
  
  // Custom validator for CVV
  cvvValidator(control: any) {
    const cvv = control.value;
    // CVV must be exactly 3 digits
    if (!/^\d{3}$/.test(cvv)) {
      return { invalidCvv: 'CVV must be exactly 3 digits long.' };
    }
    return null;
  }

  // Method to handle payment form submission
  onPaymentSubmit() {
    if (!this.cardDetails.cardNumber || !this.cardDetails.expiryDate || !this.cardDetails.cvv) {
      alert("Please fill in all card details.");
      return;
    }

    // Simulate the payment process
    this.isProcessing = true;

    // Simulating payment success with a delay
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;

      // Call to remove items from the cart and set fees to zero
      this.removeItemsFromCart();
      // this.router.navigate(['/containers']);
    }, 2000); // Payment success after 2 seconds delay
  }

  // Method to remove all items from the cart after payment and reset fees to zero
  removeItemsFromCart() {
    this.containerService.getAllContainersInCart().subscribe(
      (containers) => {
        containers.forEach((container) => {
          // Set fees to zero before removing container from cart
          container.fees = "0";  // Reset fees to zero
          
          // Update container with zero fees if necessary
          this.containerService.getContainerByNumber(container.containerNumber).subscribe(
            (response) => {
              console.log(`Fees for container ${container.containerNumber} set to zero.`);
            },
            (error) => {
              console.error(`Error updating fees for container ${container.containerNumber}:`, error);
            }
          );

          // Remove the container from the cart
          this.containerService.removeFromCart(container.containerNumber).subscribe(
            (response) => {
              console.log(`Container ${container.containerNumber} removed from cart.`);
            },
            (error) => {
              console.error(`Error removing container ${container.containerNumber}:`, error);
            }
          );
        });
        // After all containers are removed and fees set to zero, navigate to a success page
        this.router.navigate(['/payment-success']); // Example: Navigate to a success page
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  GoToHomepage(){
    this.router.navigate(['/containers']);
  }
}
