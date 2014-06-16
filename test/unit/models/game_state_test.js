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

/*jshint -W030 */
/*global describe */
/*global it */

var expect = require('chai').expect;

var GameState = require('../../../src/models/game_state.js');

var Stone = require('../../../src/models/stone.js');
var Board = require('../../../src/models/board.js');
var Move = require('../../../src/models/move.js');

describe('GameState', function() {
  describe('playMove', function() {
    it('creates a new GameState record', function() {
      var initial_game_state = new GameState({
        board: new Board(),
        current_turn: Stone.BLACK
      });

      var game_state = initial_game_state.playMove(new Move({x: 2, y: 3}));
      expect(game_state).to.be.an.instanceOf(GameState);
      expect(game_state).to.not.equal(initial_game_state);
    });

    it('sets previous_game_state', function() {
      var initial_game_state = new GameState({
        board: new Board(),
        current_turn: Stone.BLACK
      });

      var game_state = initial_game_state.playMove(new Move({x: 2, y: 3}));
      expect(game_state.previous_game_state).to.eql(initial_game_state);
    });

    it('records a move', function() {
      var initial_game_state = new GameState({
        board: new Board(),
        current_turn: Stone.BLACK
      });

      var move = new Move({x: 2, y: 3});
      var game_state = initial_game_state.playMove(move);
      expect(game_state.last_move).to.eql(move);
    });

    it('places a stone on the board', function() {
      var initial_game_state = new GameState({
        board: new Board(),
        current_turn: Stone.BLACK
      });

      var game_state = initial_game_state.playMove(new Move({x: 2, y: 3}));
      expect(
        game_state.board.stoneAt(2, 3)
      ).to.eql(
        new Stone({x: 2, y: 3, color: initial_game_state.current_turn})
      );
    });

    it('removes captures from the new board', function() {
      var board = (new Board()).placeStones(
        new Stone({x: 5, y: 4, color: Stone.BLACK}),
        new Stone({x: 3, y: 2, color: Stone.BLACK}),
        new Stone({x: 3, y: 3, color: Stone.BLACK}),
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 4, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 4, color: Stone.WHITE})
      );
      var initial_game_state = new GameState({
        board: board,
        current_turn: Stone.WHITE
      });

      var game_state = initial_game_state.playMove(new Move({x: 2, y: 3}));
      expect(game_state.board.stoneAt(5, 4)).to.be.eql(new Stone({x: 5, y: 4, color: Stone.BLACK}));
      expect(game_state.board.stoneAt(3, 2)).to.be.null;
      expect(game_state.board.stoneAt(3, 3)).to.be.null;
    });

    it('fails for suicide', function() {
      var board = (new Board()).placeStones(
        new Stone({x: 5, y: 4, color: Stone.BLACK}),
        new Stone({x: 3, y: 2, color: Stone.BLACK}),
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 4, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 4, color: Stone.WHITE}),
        new Stone({x: 2, y: 3, color: Stone.WHITE})
      );
      var initial_game_state = new GameState({
        board: board,
        current_turn: Stone.BLACK
      });

      var game_state = initial_game_state.playMove(new Move({x: 3, y: 3}));

      expect(game_state).to.be.null;
    });

    it('fails for repeat board position (ko)', function() {
      /*  0 1 2 3 4 5 6 7
       0
       1        b
       2      b w b
       3      w   w
       4        w
       5 */
      var board = (new Board()).placeStones(
        new Stone({x: 2, y: 2, color: Stone.BLACK}),
        new Stone({x: 3, y: 1, color: Stone.BLACK}),
        new Stone({x: 4, y: 2, color: Stone.BLACK}),
        new Stone({x: 2, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 2, color: Stone.WHITE}),
        new Stone({x: 4, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 4, color: Stone.WHITE})
      );
      var initial_game_state = new GameState({
        board: board,
        current_turn: Stone.BLACK
      });

      var game_state = initial_game_state.playMove(new Move({x: 3, y: 3}));
      var ko = game_state.playMove(new Move({x: 3, y: 2}));

      expect(ko).to.be.null;
    });
  });

  describe('serialize', function() {

  });
});
