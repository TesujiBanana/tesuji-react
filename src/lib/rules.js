/*******************************************************************************
 * Copyright (c) 2014 Chris Papazian
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var _ = require('underscore');

var Stone = require('../models/stone.js');
var Board = require('../models/board.js');

var Rules = {
  playMove: function(board_history, move) {
    var old_board = board_history.slice(-1)[0]

    // make sure there isn't a stone already there
    if (old_board.stoneAt(move.x, move.y)) {
      return null;
    }

    // TODO: validate current player

    // create and place the new stone
    var new_stone = new Stone(move);
    var new_board = old_board.placeStones(new_stone);

    // find dead stones and remove them
    var kills = new_board.findKills(new_stone);
    new_board = new_board.removeStones(kills);

    // check suicide
    if (this.checkSuicide(new_board, new_stone)) {
      return null;
    }

    // check ko (note: no need to check ko if there were no kills)
    if (kills && kills.length > 0 && this.checkKo(board_history, new_board)) {
      return null;
    }

    // create a new game state with the new board and the turn set
    return new_board;
  },

  checkSuicide: function(board, new_stone) {
    return board.findDeadStones(new_stone).length > 0;
  },


  checkKo: function(board_history, new_board) {
    return board_history.some(function(old_board) {
      // TODO: bloom filter ...
      return new_board.stones.length === old_board.stones.length &&
        _.isEqual(old_board.getOverlay(), new_board.getOverlay());
    });
  },
};

module.exports = Rules;
