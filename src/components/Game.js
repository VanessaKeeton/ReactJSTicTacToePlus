import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const matrix = props.matrix;
    this.state = {
      matrix: matrix,
      history: [
        {
          squares: Array(matrix*matrix).fill(null),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      orderAssending: true,
    };
  }

  componentWillMount() {
  this.initialState = this.state
  }
  
  reset() {
    this.setState(this.initialState);
  }
  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(current.squares,this.state.matrix);

    //figure out the coordinates of selected square
    const row = Math.floor((i / this.state.matrix) + 1);
    const col = Math.ceil((i % this.state.matrix) + 1);

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: row,
          col: col,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      activeIndex: null,
      winner:winner
    });
  }
  //end handleClick

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      activeIndex: step
      });
  }

  toggle() {
    this.setState({
       orderAssending: !this.state.orderAssending
     });
  }

  marks(max) {
    const points = {};
    for (let i = 0; i <= max; i++) {
                  points[i] = i + 'x' + i;
                }
    return points;
  }

  render() {
    const matrix = this.state.matrix;
    const activeIndex = this.state.activeIndex;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,this.state.matrix);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ', Col: ' + history[move].col + ' Row: ' + history[move].row :
        'Go to game start';
      return (
        <li key={move}>
          <button style={activeIndex === move ? {fontWeight : 'bold'}: null} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if(!this.state.orderAssending) { 
      moves.reverse();
    }

    let status;
    if (winner.winner !== '') {
      status = "Winner: " + winner.winner;
    } else {
      if (current.squares.includes(null)) {
          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }else{
        status = "This game is a draw."
      }
    }

    return (
      <div>
        <div className="matrix-slider">
          <p>Use the slider to change the number of squares across and down.</p>
          <Slider
                style={{ width: '50%', display: 'block' }}
                step={1}
                min={3}
                max={20}
                value={this.state.matrix}
                onChange={val => this.setState({ matrix: val })}
                marks={this.marks(20)}
                disabled={moves[1] ? true : false}
              />
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              winner={winner}
              onClick={i => this.handleClick(i)}
              matrix={matrix}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <button onClick={() => this.toggle()}>Reverse</button>
            <button onClick={() => this.reset()}>Reset Game</button>
          </div>
        </div>
      </div>
    );
  }
  //end render
}


function calculateWinner(squares,matrix) {
  // set winning combinations
  let winningCombinations = [];
  for (let i = 0; i < (matrix * 2) + 2; i++) {
    winningCombinations.push([]);
  }
  let jStore = 0;
  let currentIndex;

  //across cols win
  for (let i = 0; i < matrix; i++) {
    for (let j = 0; j < matrix; j++) {
      currentIndex = j + jStore;
      winningCombinations[i].push(currentIndex);
      if (j === matrix - 1) {
        jStore = j + jStore + 1 ;
      };
    }
  }

  //down rows win
  for (let i = 0; i < matrix; i++) {
    currentIndex = i;
    for (let j = 0; j < matrix; j++) {
      if (j !== 0) {
        currentIndex = currentIndex + matrix;
      }
      winningCombinations[i + matrix].push(currentIndex);
    }
  }

  // diaginal win 1 ;
  let sqaureIndex = 0;
  for (let i = 0; i < matrix; i++) {
    winningCombinations[matrix + matrix].push(sqaureIndex);
    sqaureIndex = sqaureIndex + matrix + 1;
  }

  // diaginal win 2
  sqaureIndex = matrix - 1;
  for (let i = 0; i < matrix; i++) {
    winningCombinations[matrix + matrix + 1].push(sqaureIndex);
    sqaureIndex = sqaureIndex + matrix - 1;
  }

//test for winning combination
for (let i = 0; i < winningCombinations.length; i++) {
  let combination = [];
    winningCombinations[i].forEach(function (square, index){
        combination.push(squares[square]);
      });

    if (AllValuesSameButNotNull(combination)) {
      return {
        winner : combination[0], 
        winningCombination : winningCombinations[i]
      };
    }
  }
  return {
        winner : '', 
        winningCombination : ''
      };
}

function AllValuesSameButNotNull(array){
 
  if(array.length > 0) {
    for(var i = 1; i < array.length; i++)
    {
      if (array[i] === null || array[i] === undefined || array[i] !== array[0]) {
        return false;
      }
    }
  } 
  return true;
}

export default Game;