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

var GameState = Model.extend({
  attributes: ['board', 'kills', 'current_turn', 'previous_game_state'],
  methods: {
    playMove: function(x, y) {
      // make sure there isn't a stone already there
      if (this.board.stoneAt(x, y)) {
        return null;
      }

      // create and place the new stone
      var new_stone = new Stone({x: x, y: y, color: this.current_turn});
      var new_board = this.board.placeStones(new_stone)

      // find dead stones and remove them
      var kills = new_board.findKills(new_stone);
      // TODO: record kills      
      new_board = new_board.removeStones(kills);

      // check suicide
      if (this.checkSuicide(new_board, new_stone)) {
        return null;
      }

      // check ko
      if (this.checkKo(new_board)) { 
        return null;
      }

      // create a new game state with the new board and the turn set
      return new GameState({
        board: new_board,
        kills: this.kills,
        current_turn: (this.current_turn + 1) % 2,
        previous_game_state: this
      });
    },

    checkSuicide: function(new_board, new_stone) {
      return new_board.findDeadStones(new_stone).length > 0
    },

    checkKo: function(new_board) {
      var previous_game_state = this;
      while (previous_game_state) {
        if (
          _.all(
            _.zip(
              new_board.grid,
              previous_game_state.board.grid
            ), 
            function(stones) {
              var new_stone = stones[0] ? stones[0].color : null;
              var old_stone = stones[1] ? stones[1].color : null;
              return new_stone === old_stone;
            }
          )
        ) { return true; }
        previous_game_state = previous_game_state.previous_game_state;
      }
      return false;
    },
    
    valid: function() { return true; }
  }
});

module.exports = GameState;
