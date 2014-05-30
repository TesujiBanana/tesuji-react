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
  properties: ['board', 'kills', 'current_turn', 'previous_game_state']
});

GameState.prototype.playMove = function(x, y) {
  var stone = new Stone(x, y, this.current_turn);
  var new_board = this.board.placeStones(stone);
  if (!new_board) { return null }

  return new GameState({
    board: new_board,
    kills: this.kills,
    current_turn: (this.current_turn + 1) % 2,
    previous_game_state: this
  });
};

module.exports = GameState;
