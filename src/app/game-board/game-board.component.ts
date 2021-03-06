import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  @Input() darkMode;
  @Output() updateScore = new EventEmitter();
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
  locked: boolean;
  draw: boolean;
  currentPlayer: {
    name: string,
    symbol: string
  };
  score: {
    playerOne: number,
    playerTwo: number
  };
  audio = {
    blip1: new Audio(),
    blip2: new Audio(),
    draw: new Audio(),
    win: new Audio(),
    restart: new Audio()
  };

  constructor() { }

  ngOnInit() {
    this.initSound(this.audio);
    this.firstGame = true;
    this.score = {
      playerOne: 0,
      playerTwo: 0,
    };
    this.resetGame();
  }

  initSound(audio){
    Object.keys(audio).map(sound => {
      audio[sound].src = "../assets/sounds/" + sound + ".wav";
      audio[sound].load();
    })
  }

  // Intializes game
  resetGame() {
    console.log(`Player 1: ${this.score.playerOne}`);
    console.log(`Player 2: ${this.score.playerTwo}`);
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
    this.locked = false;
    this.draw = false;
    this.currentPlayer = this.PlayerOne;
  }

  // Handles when square is clicked
  clickSquare(square) {
    if(square.value === '' && this.playing && !this.locked) {
      if(this.currentPlayer.name == "Player 1"){
        this.playSound('blip1');
        this.locked = true;
      } else{
        this.playSound('blip2');
      }
      square.value = this.currentPlayer.symbol;
      this.handleMove(this.currentPlayer);
    }
  }

  // Handles Move made by a player
  handleMove(player) {
    this.currentPlayer = this.PlayerTwo;
    if(this.checkWin(player.symbol)) 
      //Handles win if somebody won
      this.handleWin(player);
    else if(this.boardFull())
      // Handles if there are no moves left
      this.handleDraw();
    else {  
      // //Switches players if game is not over
      // this.currentPlayer = (this.currentPlayer == this.PlayerOne ? this.PlayerTwo : this.PlayerOne);
      // Makes a computers move if game is not over
      if(player.name == "Player 1"){
        setTimeout(() => {
          this.makeComputerMove();
        }, 500);
      } else {
        this.currentPlayer = this.PlayerOne;
      }
    }
  }

  makeComputerMove(){
    let bestIndex;
    if(Math.random() > 0.7){
      bestIndex = this.getRandomMove(this.board);
    } else{
      bestIndex = this.minimax(this.board, 'O');
    }

    if(bestIndex.index != null){
      this.currentPlayer = this.PlayerTwo;
      this.locked = false;
      this.clickSquare(this.board[bestIndex.index]);
    }
  }

  // Checks if board is full
  boardFull(): boolean {
    return this.board.filter(s => s.value == '').length == 0;
  }

  // Checks if a player won
  checkWin(symbol, test = false): boolean {
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
          if(!test){
            this.board[index].winner = true;
          }
        }
        return true;
      }
    }

    return false;
  }

  handleWin(winner) {
    this.playSound('win');
    this.playing = false;
    if(winner.name == 'Player 1'){
      this.score.playerOne++;
    } else {
      this.score.playerTwo++;
    }
    this.updateScore.emit({ score: this.score });
    this.latestWinner = winner; 
  }

  handleDraw() {
    this.playSound('draw');
    this.playing = false;
    this.draw = true;
  }

  playSound(sound) {
    this.audio[sound].play()
  }

  // AI for Computer moves
  getRandomMove(newBoard){
    var availSpots = this.emptyIndexes(newBoard);
    if(availSpots){
      return {index: availSpots[Math.floor(Math.random() * (availSpots.length))]};
    } else{
      return null;
    }
  }

  /**
   * Returns an object that has the index of the best move
   * @param {Object[]} newBoard - The Current Board
   * @param {string} player - The Symbol of the Computer
   */
  minimax(newBoard, player){
    //available spots
    var availSpots = this.emptyIndexes(newBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    // This is for the recursive function
    if (this.checkWin('O', true)){
      return {score:-10};
    }
    else if (this.checkWin('X', true)){
      return {score:10};
    }
    else if (availSpots.length === 0){
      return {score:0};
    }

    // an array to collect all the objects
    var moves = [];

    // loop through available spots
    // Pushes all available moves into the moves array
    for (var i = 0; i < availSpots.length; i++){
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {
        index: null,
        score: null
      };
  
      // move.index = newBoard[availSpots[i]];
      move.index = availSpots[i];
  
      // set the empty spot to the current player
      newBoard[availSpots[i]].value = player;
  
      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == 'X'){
        var result = this.minimax(newBoard, 'O');
        move.score = result.score;
      }
      else{
        var result = this.minimax(newBoard, 'X');
        move.score = result.score;
      }
  
      //reset the spot to empty
      newBoard[availSpots[i]].value = '';
  
      // push the object to the array
      moves.push(move);
    }

    
    // Returns the best possible move for either X or O
    // Assumes aiPlayer = 'X'  and  huPlayer = 'O'
    var bestMove;
    if(player === 'X'){
      // if it is the computer's turn loop over the moves and choose the move with the highest score
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
      // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

  // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
  }

  // returns the available spots on the 
  // TODO: Rewrite this to take in a a board Object[] and return an array with the indexes that are empty
  /**
   * Returns an array of the empty indexes
   * @param {string[]} board - Any board
   * 
   */
  emptyIndexes(board){
    const indexes = [];
    board.forEach((object, i) => {
      if(object.value == '' ){
        indexes.push(i);
      }
    });
    return  indexes;
  }
}
