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

var Rules = require('../lib/rules.js');

var Board = require('./board.js');
var Stone = require('./stone.js');

var Game = Model.extend({
  attributes: ['moves', 'handicap', 'komi', 'black_player', 'white_player', 'current_turn'],
  defaults: {
    moves: [],
    handicap: 0,
    current_turn: Stone.BLACK
  },
  methods: {
    initialize: function(attributes) {
      if (attributes.moves.length > 0) {
        attributes.moves = attributes.moves.map(function(m) { return new Stone(m) });
      }
      return attributes;
    },

    //   return _.extend(attributes, {
    //     current_turn: attributes.handicap === 0 ?
    //       Stone.BLACK :
    //       Stone.WHITE,
    //     // komi: !attributes.komi && attributes.handicap === 0 ?
    //     //   6.5 :
    //     //   0.5
    //   });
    // },
    // TODO: memoize ...
    board: function() {
      // TODO: implement handicaps ...
      return (function _board(board_history, moves) {
        if (moves.length === 0) {
          return board_history.slice(-1)[0];
        }
        else {
          var new_board = Rules.playMove(board_history, moves[0]);
          return _board(
            board_history.concat(new_board),
            moves.slice(1)
          );
        }
      })([new Board()], this.moves);
    },
  },
});

module.exports = Game;
