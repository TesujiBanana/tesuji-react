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

var Game = require('../../../src/models/game.js');

var Board = require('../../../src/models/board.js');
var Stone = require('../../../src/models/stone.js');

describe('Game', function() {
  describe('.initialize', function() {
    it('sets current_turn to BLACK for even game', function() {
      var game = new Game();
      expect(game.current_turn).to.eql(Stone.BLACK);
    });

    it('sets current_turn to WHITE for a handicap game'); //, function() {
    //   var game = new Game({handicap: 2});
    //   expect(game.current_turn).to.eql(Stone.WHITE);
    // });
  });

  describe('.board', function() {
    it('returns a blank board for a blank game', function() {
      var game = new Game();
      expect(game.board()).to.eql(new Board());
    });

    it('returns a board with stones for a game with moves', function() {
      var game = new Game({
        moves: [
          new Stone({x: 2, y: 3, color: Stone.BLACK}),
          new Stone({x: 15, y: 15, color: Stone.WHITE})
        ]
      });
      expect(game.board()).to.eql((new Board()).placeStones(
        new Stone({x: 2, y: 3, color: Stone.BLACK}),
        new Stone({x: 15, y: 15, color: Stone.WHITE})
      ));
    });

    it('handles kills', function() {
      var game = new Game({
        moves: [
          new Stone({x: 5, y: 4, color: Stone.WHITE}),
          new Stone({x: 1, y: 2, color: Stone.BLACK}),
          new Stone({x: 3, y: 2, color: Stone.WHITE}),
          new Stone({x: 2, y: 2, color: Stone.BLACK}),
          new Stone({x: 3, y: 3, color: Stone.WHITE}),
          new Stone({x: 3, y: 1, color: Stone.BLACK}),
          new Stone({x: 9, y: 9, color: Stone.WHITE}),
          new Stone({x: 4, y: 2, color: Stone.BLACK}),
          new Stone({x: 9, y: 10, color: Stone.WHITE}),
          new Stone({x: 4, y: 3, color: Stone.BLACK}),
          new Stone({x: 9, y: 11, color: Stone.WHITE}),
          new Stone({x: 3, y: 4, color: Stone.BLACK}),
          new Stone({x: 9, y: 12, color: Stone.WHITE}),
          new Stone({x: 2, y: 3, color: Stone.BLACK})
        ]
      });

      var board = game.board();
      expect(board.stoneAt(5, 4)).to.be.eql(new Stone({x: 5, y: 4, color: Stone.WHITE}));
      expect(board.stoneAt(3, 2)).to.be.null;
      expect(board.stoneAt(3, 3)).to.be.null;
    });
  });
});
