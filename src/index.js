import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//Though it's not normal tic tac tow to have a non 3x3 matrix, I like the idea of making the board's matrix data driven, so I did.
//So in this way one might be able to reuse some componets and turn it to bingo or some such thing
//set board rows and columns number
let matrix = 3;

class Board extends React.Component {
   renderRows(numRows,numCols) {
	let rows = [];
	let numSquares = 0;
	for (let i = 0; i < numRows; i++) {
		numSquares = (numCols * i)
		let cols = [];
		for (let j = numSquares ;j < numCols + numSquares; j++) {
			console.log(this.props.winner.winningCombination);
       		cols.push(
       			<Square
			        value={this.props.squares[j]}
			        key={j}
			        onClick={() => this.props.onClick(j)}
			        className = {this.props.winner.winningCombination.includes(j) ? 'winning-square square' : 'square'}
		      	/>
		      );
      }
      rows.push(<div key={ i } className="board-row">{cols}</div>);
	}
	return rows;
}

  render() {
    return (
      <div>
        {this.renderRows(matrix,matrix)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(current.squares,matrix);
 
    //figure out the coordinates of selected square
    const row = Math.floor((i / matrix) + 1);
    const col = Math.ceil((i % matrix) + 1);

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

  render() {
  	const activeIndex = this.state.activeIndex;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,matrix);

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
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggle()}>Reverse</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
        	if (array[i] === null || array[i] !== array[0]) {
        		return false;
        	}
        }
    } 
    return true;
}
