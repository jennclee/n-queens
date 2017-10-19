// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },
    // Major diagonal starts from top left corner to bottom right corner; starts index as 0; diagonal starts to the right of (0,0) are positive, diagonals to the left are negative
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },
    // Minor diagonal are opposite direction of major diagonals; top left (0,0) starts count at 0; moving to the right of origin increases diagonal index
    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyRooksConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasAnyRowConflicts() || this.hasAnyColConflicts()
      );
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    // this.get(n) will show array of row n
    // this.get('n') will show size of board ('n' property when board is created)

/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // Helper function for returning conflicts
    hasConflict: function(arr) {
      var count = 0;
      for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] === 1 ) {
          count++;
        }
      }
      return ( count > 1 );
    },

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // if row already contains a 1, return true
      var row = this.get(rowIndex);
      return this.hasConflict(row);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // for each row on the board
      for ( var i = 0; i < this.get('n'); i++ ) {
      // run hasRowConflictAt for that rowIndex
      // as soon as there is a row conflict, return true
        if ( this.hasRowConflictAt(i) ) {
          return true;
        }
      }
      // else return false
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // create col array to check
      var colArray = [];
      var boardSize = this.get('n');
      // for each row on board, go to colIndex of that row
      for ( var i = 0; i < boardSize; i++ ) {
        // store value of colIndex into col array
        colArray.push(this.get(i)[colIndex]);
      }
      // do the same count situation as hasRowConflictAt
      return this.hasConflict(colArray);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var boardSize = this.get('n');
      // for each column on the board
      for ( var i = 0; i < boardSize; i++ ) {
      // run hasColConflictAt for that colIndex
      // as soon as there is a column conflict, return true
        if ( this.hasColConflictAt(i) ) {
          return this.hasColConflictAt(i);
        }
      }
      // else return false
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // majorDiagonalColumnIndexAtFirstRow will either be a positive or negative number
        // pos num means to the right of the main diagonal
        // neg num means to the left of the main diagonal
        // main diagonal is always 0

      // (0,0) diagIdx = 0
      // (0,1) diagIdx = 1
      // (1,0) diagIdx = -1
    
      var majorDiagArray = [];
      var boardSize = this.get('n');
      // for each row on board, go to colIndex of that row
      for ( var i = 0; i < boardSize; i++ ) {
        // take rowIdx and invert for first element in row to get diagIdx
        var majDiagIdx = -i;
        var row = this.get(i);
        // majorDiagonalColumnIndexAtFirstRow - (-rowIdx) to get row index for major diagonal value
        var rowIdx = majorDiagonalColumnIndexAtFirstRow - majDiagIdx;
        // store val in majorDiagArray
        majorDiagArray.push(row[rowIdx]);
      }
      // execute and return result of hasConflict(majorDiagArray)
      return this.hasConflict(majorDiagArray);
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var boardSize = this.get('n');
      // for each column on the board
      for ( var i = -(boardSize - 1); i < boardSize; i++ ) {
      // run hasColConflictAt for that colIndex
      // as soon as there is a column conflict, return true
        if ( this.hasMajorDiagonalConflictAt(i) ) {
          return this.hasMajorDiagonalConflictAt(i);
        }
      }
      // else return false
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var minorDiagArray = [];
      var boardSize = this.get('n');
      // for each row on board, go to colIndex of that row
      for ( var i = 0; i < boardSize; i++ ) {
        // take rowIdx and invert for first element in row to get diagIdx
        var row = this.get(i);
      // rowIdx of stated diagonal: minorDiagonalColumnIndexAtFirstRow - rowIdx in board array
        var rowIdx = minorDiagonalColumnIndexAtFirstRow - i;
        // store val in majorDiagArray
        minorDiagArray.push(row[rowIdx]);
      }
      // execute and return result of hasConflict(majorDiagArray)
      return this.hasConflict(minorDiagArray);
      
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var boardSize = this.get('n');
      // for each column on the board
      for ( var i = 0; i < ( 2 * ( boardSize - 1) ); i++ ) {
      // run hasColConflictAt for that colIndex
      // as soon as there is a column conflict, return true
        if ( this.hasMinorDiagonalConflictAt(i) ) {
          return this.hasMinorDiagonalConflictAt(i);
        }
      }
      // else return false
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
