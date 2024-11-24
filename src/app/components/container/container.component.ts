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

  constructor(private containerService: ContainerService, private router: Router) { }

  ngOnInit(): void {
    // Load stored containers from localStorage when the component initializes
    const storedContainers = localStorage.getItem('userContainers');
    this.containers = storedContainers ? JSON.parse(storedContainers) : [];
  }

  // Add the container based on entered container number to the watchlist
  addContainerToWatchlist() {
    if (this.containerNumber) {
      // For now, we're simulating a fetch from an API using mock data for the container
      this.containerService.getContainerByNumber(this.containerNumber).subscribe(
        (response: CosmosItem) => {
          // Add the container to the list if it was found
          this.containers.push(response);
          // Save the updated list to localStorage
          localStorage.setItem('userContainers', JSON.stringify(this.containers));
          // Clear input after adding
          this.containerNumber = '';
          this.errorMessage = ''; // Clear any previous errors
        },
        (error) => {
          // Show error message if container is not found
          this.errorMessage = 'Container not found!';
        }
      );
    } else {
      this.errorMessage = 'Please enter a container number.';
    }
  }

  // Add a container to the cart (or perform some action with it)
  addToCart(container: CosmosItem) {
    container.cartAdded = true;
    this.containerService.addToCart(container).subscribe(
      (response: string) => {
        console.log(response); // Log or process the plain text response
      },
      (error) => {
        console.error('Error adding to cart', error);
      }
    );
  }
  deleteContainer(containerNumber: string) {
    this.containerService.deleteContainerData(containerNumber).subscribe(
      () => {
        // Remove the container from the local list after successful deletion
        this.containers = this.containers.filter(item => item.containerNumber !== containerNumber);
        // Also update localStorage after removal
        localStorage.setItem('userContainers', JSON.stringify(this.containers));
      },
      (error) => {
        console.error('Error deleting container', error);
        // You could display an error message here to the user
      }
    );
  }
  // Navigate to cart page or show cart items
  viewCart() {
    console.log('Navigating to View Cart page or showing cart items');
    this.router.navigate(['/viewcart']);
  }
}

