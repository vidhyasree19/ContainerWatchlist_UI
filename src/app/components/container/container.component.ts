import { Component, OnInit } from '@angular/core';
import { ContainerService } from '../../services/container.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  fees: string;
  cartAdded?: boolean;
}

@Component({
  selector: 'app-container-input',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CosmosContainerComponent implements OnInit {
  containerNumber: string = ''; // Holds the container number input value
  containers: CosmosItem[] = []; // Array to hold multiple containers
  errorMessage: string = ''; // For error messages
  isLoading: boolean = false; // Loading flag
  displayedColumns: string[] = ['containerNumber', 'tradeType', 'status', 'vesselName', 'vesselCode', 'voyage', 'origin', 'line', 'destination', 'sizeType', 'fees', 'action'];

  constructor(private containerService: ContainerService, private router: Router) {}

  ngOnInit(): void {
    // Load stored containers from localStorage when the component initializes
    const storedContainers = localStorage.getItem('userContainers');
    this.containers = storedContainers ? JSON.parse(storedContainers) : [];
  }

  // Add the container based on entered container number to the watchlist
  addContainerToWatchlist() {
    if (this.containerNumber) {
      this.isLoading = true; // Set loading state true while fetching data
      this.containerService.getContainerByNumber(this.containerNumber).subscribe(
        (response: CosmosItem) => {
          // Add the container to the list if it was found
          this.containers.push(response);
          // Save the updated list to localStorage
          localStorage.setItem('userContainers', JSON.stringify(this.containers));
          // Clear input after adding
          this.containerNumber = '';
          this.errorMessage = ''; // Clear any previous errors
          this.isLoading = false; // Set loading state to false after data is fetched
        },
        (error) => {
          // Show error message if container is not found
          this.errorMessage = 'Container not found!';
          this.isLoading = false; // Set loading state to false even if there's an error
        }
      );
    } else {
      this.errorMessage = 'Please enter a container number.';
    }
  }

  // Getter to check if fees are greater than 0
  isFeesGreaterThanZero(fees: string): boolean {
    const feesValue = parseFloat(fees);
    return !isNaN(feesValue) && feesValue > 0;
  }

  // Add a container to the cart (or perform some action with it)
  addToCart(container: CosmosItem) {
    // Convert fees to a number and check if it's greater than 0
    const fees = parseFloat(container.fees);

    if (!isNaN(fees) && fees > 0) {
      container.cartAdded = true; // Mark this container as added to the cart

      // Save updated containers to localStorage, including the cartAdded state
      localStorage.setItem('userContainers', JSON.stringify(this.containers));

      this.isLoading = true; // Set loading state to true while adding to cart
      // Call the service to add to the cart
      this.containerService.addToCart(container).subscribe(
        (response: string) => {
          console.log(response); // Log or process the plain text response
          this.isLoading = false; // Set loading state to false after the action
        },
        (error) => {
          console.error('Error adding to cart', error);
          this.isLoading = false; // Set loading state to false even on error
        }
      );
    } else {
      this.errorMessage = 'Cannot add container to cart because fees are 0 or less.';
    }
  }

  deleteContainer(containerNumber: string) {
    this.isLoading = true; // Set loading state to true while deleting the container
    this.containerService.deleteContainerData(containerNumber).subscribe(
      () => {
        // Remove the container from the local list after successful deletion
        this.containers = this.containers.filter(item => item.containerNumber !== containerNumber);
        // Also update localStorage after removal
        localStorage.setItem('userContainers', JSON.stringify(this.containers));
        this.isLoading = false; // Set loading state to false after successful deletion
      },
      (error) => {
        console.error('Error deleting container', error);
        this.isLoading = false; // Set loading state to false even if there's an error
      }
    );
  }

  // Navigate to cart page or show cart items
  viewCart() {
    console.log('Navigating to View Cart page or showing cart items');
    this.router.navigate(['/viewcart']);
  }
}
