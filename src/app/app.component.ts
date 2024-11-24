import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CosmosContainerComponent } from './components/container/container.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ContainerWatchlist_UI';
}

