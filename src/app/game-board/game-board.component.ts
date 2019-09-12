import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  @Input() darkMode;
  PlayerOne = { name: "Player 1", symbol: 'X'};
  PlayerTwo = { name: "Player 2", symbol: 'O'};

  board: any[];
  firstGame: boolean;
  winner: string;
  latestWinner: {
    name: string,
    symbol: string
  };
  playing: boolean;
  draw: boolean;
  currentPlayer: {
    name: string,
    symbol: string
  };

  constructor() { }

  ngOnInit() {
    this.firstGame = true;
    this.resetGame();
  }

  // Intializes game
  resetGame() {
    if(!this.firstGame){
      this.playSound('restart');
    }
    // Create board and start game states
    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];
    this.firstGame = false;
    this.winner = null;
    this.playing = true;
    this.draw = false;
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
    if(this.checkWin(player.symbol)) 
      //Handles win if somebody won
      this.handleWin(player);
    else if(this.boardFull())
      // Handles if there are no moves left
      this.handleDraw();
    else {  
      //Switches players if game is not over
      if(player.name == "Player 1"){
        this.playSound('blip1');
      } else{
        this.playSound('blip2');
      }
      this.currentPlayer = (this.currentPlayer == this.PlayerOne ? this.PlayerTwo : this.PlayerOne);
    }
  }

  // Checks if board is full
  boardFull(): boolean {
    return this.board.filter(s => s.value == '').length == 0;
  }

  // Checks if a player won
  checkWin(symbol): boolean {
    const possibleWins = [
      [0, 1, 2],  //top row
      [3, 4, 5],  //middle row
      [6, 7, 8],  //bottom row
      [0, 3, 6],  //first col
      [1, 4, 7],  //second col
      [2, 5, 8],  //third col
      [0, 4, 8],  //diagonal top left to bottom right
      [2, 4, 6]   //diagonal bottom left to top right
    ]
    for(let pattern of possibleWins) {
      // Sets foundWinner if all three pattern indexs match a given symbol
      const foundWinner = this.board[pattern[0]].value == symbol
        && this.board[pattern[1]].value == symbol
        && this.board[pattern[2]].value == symbol;

      if(foundWinner) {
        // Gives winning indexs a "winner" attribute
        for(let index of pattern) {
          this.board[index].winner = true;
        }
        return true;
      }
    }

    return false;
  }

  handleWin(winner) {
    this.playSound('win');
    this.playing = false;
    this.latestWinner = winner; 
  }

  handleDraw() {
    this.playSound('draw');
    this.playing = false;
    this.draw = true;
  }

  playSound(sound) {
    sound = "../assets/sounds/" + sound + ".wav";
    sound && ( new Audio(sound) ).play()
  }
}
