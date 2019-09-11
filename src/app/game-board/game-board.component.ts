import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  PlayerOne = { name: "Player 1", symbol: 'X'};
  PlayerTwo = { name: "Player 2", symbol: 'O'};

  board: any[];
  winner: string;
  playing: boolean;
  currentPlayer: {
    name: string,
    symbol: string
  };

  constructor() { }

  ngOnInit() {
    this.playGame();
  }

  // Intializes game
  playGame() {

    // Create board and start game states
    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];
    this.winner = null;
    this.playing = true;
    this.currentPlayer = this.PlayerOne;
  }

  // Handles when square is clicked
  clickSquare(square) {
    if(square.value === '' && this.playing) {
      square.value = this.currentPlayer.symbol;
      this.handleMove(this.currentPlayer);
    }
  }

  // Handles Move made by a player
  handleMove(player) {
    // if(this.checkWin(player.symbol)) 
    //   //Handles win if somebody won
    //   console.log(`${player.name} wins!`);
    // else if(!this.anyMovesLeft())
    //   // Handles if there are no moves left
    //   console.log(`Draw. Game Over`);
    // else {  
      // Switches players if game is not over
      this.currentPlayer = (this.currentPlayer == this.PlayerOne ? this.PlayerTwo : this.PlayerOne);
    // }

  }



}
