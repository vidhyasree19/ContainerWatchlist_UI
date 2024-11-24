import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CosmosContainerComponent } from './components/container/container.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ContainerWatchlist_UI';
}

