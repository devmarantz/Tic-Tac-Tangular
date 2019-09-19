import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-tangular';
  darkMode = false; 
  showScore = true;
  score = {
    playerOne: 0,
    playerTwo: 0
  };


  handleInner() {
    this.darkMode = !this.darkMode;
  };

  changeScore(event){
    this.showScore = true;
    this.score = event.score;
  }
}
