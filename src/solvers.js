/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  // rooks will only look for rows and columns
  // solution occurs when there are no conflicts in rows and columns
  
  // create new board
  var board = new Board({'n': n});  
  // store row and column of rook so no other rooks will be placed there
  var idx = 0;
  // place n rooks on board while n > 0
  while (n > 0) {
    board.togglePiece(idx, idx);
    // check for conflicts using hasAnyRooksConflictsOn(row, column)
    if ( !board.hasAnyRooksConflictsOn(idx, idx) ) {
      idx++; 
      n--;
    }
  }

  return board.rows(); // board matrix 
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // solution for rooks will be factorial of n
  var factorial = function(n) {
    return n > 1 ? n * factorial(n - 1) : n;
  };
  return factorial(n);
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var addQueens = function(row) {
  // base cases
    // if there is a queen conflict, stop exploring
      // move back up to previous row and reposition queen
    // if there is a solution (all queens are on board and reached n-1 row), return board
  
  // function to pass board and row in
    // for every column:
    for (var col = 0; col < n; col++) {
      board.togglePiece(row, col); 
      // check if there is a conflict when placing the queen
      if ( !board.hasAnyQueenConflictsOn(row, col) ) {     
        if ( row === n - 1 ) {
          return true;
        }
        // move down to next row and repeat
        var solution = addQueens(row + 1);
        if ( solution ) {
          return solution;
        }
      }
      board.togglePiece(row, col);
    }
    return false;
  }
  addQueens(0);
  return board.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});
  if ( n === 0 ) {
    return 1;
  }
  var addQueens = function(row) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(row, col); 
      if ( !board.hasAnyQueenConflictsOn(row, col) ) {     
        if ( row === n - 1 ) {
          solutionCount++;
        } else {
          addQueens(row + 1);
        }
      }
      board.togglePiece(row, col);
    }
  }
  addQueens(0);
  return solutionCount;
};














