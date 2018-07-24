import React from 'react';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick} disabled={props.value ? true : false}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderRows(numRows,numCols) {
    let rows = [];
    let numSquares = 0;
    for (let i = 0; i < numRows; i++) {
      numSquares = (numCols * i)
      let cols = [];
      for (let j = numSquares ;j < numCols + numSquares; j++) {
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
        {this.renderRows(this.props.matrix,this.props.matrix)}
      </div>
    );
  }
}

export default Board;