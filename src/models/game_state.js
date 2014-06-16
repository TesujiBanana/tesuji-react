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

var Model = require('../lib/model.js');

var Board = require('./board.js');
var Stone = require('./stone.js');
var Move = require('./move.js');

var GameState = Model.extend({
  attributes: ['board', 'last_move', 'kills', 'current_turn', 'previous_game_state'],
  methods: {
    playMove: function(move) {
      // make sure there isn't a stone already there
      if (this.board.stoneAt(move.x, move.y)) {
        return null;
      }

      // create and place the new stone
      var new_stone = new Stone({x: move.x, y: move.y, color: this.current_turn});
      var new_board = this.board.placeStones(new_stone)

      // find dead stones and remove them
      var kills = new_board.findKills(new_stone);
      // TODO: record kills
      new_board = new_board.removeStones(kills);

      // check suicide
      if (this.checkSuicide(new_board, new_stone)) {
        return null;
      }

      // check ko (note: no need to check ko if there were no kills)
      if (kills && kills.length > 0 && this.checkKo(new_board)) {
        return null;
      }

      // create a new game state with the new board and the turn set
      return new GameState({
        board: new_board,
        kills: (this.kills ? this.kills : []).concat(kills),
        last_move: move,
        current_turn: (this.current_turn + 1) % 2,
        previous_game_state: this
      });
    },

    checkSuicide: function(new_board, new_stone) {
      return new_board.findDeadStones(new_stone).length > 0
    },

    checkKo: function(new_board) {
      var matcher = _.matches(new_board.getOverlay());
      var previous_game_state = this;
      while (previous_game_state) {
        if (
          new_board.stones.length === previous_game_state.board.stones.length &&
          _.isEqual(
            new_board.getOverlay(),
            previous_game_state.board.getOverlay()
          )
        ) {
          return true;
        }
        previous_game_state = previous_game_state.previous_game_state;
      }
      return false;
    },

    valid: function() { return true; }
  },


});

module.exports = GameState;
