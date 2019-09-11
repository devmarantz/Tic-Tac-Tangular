import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  PlayerOne = { name: "Player 1", symbol: 'X'};
  PlayerTwo = { name: "Player 2", symbol: 'O'};

  board: string[];
  winner: string;
  playing: boolean;
  currentPlayer: object;

  constructor() { }

  ngOnInit() {
    this.playGame();
  }

  // Intializes game
  playGame() {

    // Create board and start game states
    this.board = [
      '', '', '',
      '', '', '',
      '', '', '',
    ];
    this.winner = null;
    this.playing = true;
    this.currentPlayer = this.PlayerOne;

    

  }

}
