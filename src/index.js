import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './components/Game';


//Though it's not normal tic tac tow to have a non 3x3 matrix, I like the idea of making the board's matrix data driven, so I did.
//So in this way one might be able to reuse some components and turn it to bingo or some such thing
//set board rows and columns number
let matrix = 3;//set default

// ========================================

ReactDOM.render(<Game matrix={matrix} />, document.getElementById("root"));
