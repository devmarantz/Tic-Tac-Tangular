import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-tangular';
  darkMode = false; 


  handleInner() {
    this.darkMode = !this.darkMode;
  };
}
