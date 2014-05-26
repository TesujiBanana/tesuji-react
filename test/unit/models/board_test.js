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

var _ = require('underscore');

var Board = require('../../../src/models/board.js'); 
var Stone = require('../../../src/models/stone.js'); 

var placeManyStones = function(board, stones) {
  return _.compose.apply(null, stones.map(function(stone) {
    return _.partial(Board.placeStone, _, stone);
  }))(board);
};

describe('new', function() {
  it('sets board_size to 19 by default', function() {
    var board = new Board();
    expect(board.board_size).to.equal(19);
  });
});

describe('.stoneAt', function() {
  it('returns null for an empty position', function() {
    var board = new Board();
    expect(board.stoneAt(3, 3)).to.be.null;
  });
  
  it('returns the stone, if one has been placed', function() {
    var empty_board = new Board();
    var board = Board.placeStone(empty_board, new Stone(3, 3, Stone.BLACK));
    expect(board.stoneAt(3, 3).color).to.equal(Stone.BLACK);
  });
});

describe('.placeStone', function() {
  it('returns old board for an out of bounds position', function() {
    var board = new Board();
    expect(Board.placeStone(board, new Stone(19, 19, Stone.BLACK))).to.be.null;
  });
  
  it('returns a new board for a valid move', function() {
    var board = new Board();
    var new_board = Board.placeStone(board, new Stone(3, 3, Stone.BLACK));
    expect(new_board).to.be.an.instanceof(Board);
    expect(new_board).to.not.equal(board);
  });

});

describe('.liberty', function() {
  it('returns true for a lone stone in the center of the board', function() {
    var board = Board.placeStone(new Board(19), new Stone(3, 3, Stone.BLACK));
    expect(board.liberty(3,3)).to.be.true;
  });

  it('returns false if a stone in the center is surrounded', function() {
    var board = placeManyStones(new Board(19), [
      new Stone(3, 2, Stone.BLACK),
      new Stone(2, 2, Stone.WHITE),
      new Stone(3, 1, Stone.WHITE),
      new Stone(4, 2, Stone.WHITE),
      new Stone(3, 3, Stone.WHITE)
    ]);
    expect(board.liberty(3,2)).to.be.false;
  });

  it('returns false if a stone on the edge is surrounded', function() {
    var board = placeManyStones(new Board(19), [
      new Stone(5,0,0),
      new Stone(4,0,1),
      new Stone(6,0,1),
      new Stone(5,1,1)
    ]);
    expect(board.liberty(5,0)).to.be.false;
  });
  
  it('returns false if a stone at the corner is surrounded', function() {
    var board = placeManyStones(new Board(19), [
      new Stone(18,18,0),
      new Stone(17,18,1),
      new Stone(18,17,1)
    ]);
    expect(board.liberty(18,18)).to.be.false;
  });
});

describe('.findDeadStones', function() {
  it('returns nothing for a lone stone in the center of the board', function() {
    var stone = new Stone(3, 3, Stone.BLACK);
    var board = Board.placeStone(new Board(19), stone);
    expect(Board.findDeadStones(board, [stone])).to.eql([]);
  });
  
  it('for a lone surrounded stone, returns a list with the dead stone', function() {
    var dead_stone = new Stone(3, 2, Stone.BLACK);
    var board = placeManyStones(new Board(19), [
      dead_stone, 
      new Stone(2, 2, Stone.WHITE),
      new Stone(3, 1, Stone.WHITE),
      new Stone(4, 2, Stone.WHITE),
      new Stone(3, 3, Stone.WHITE)
    ]);
    expect(Board.findDeadStones(board, [dead_stone])).to.eql([dead_stone]); 
  });

  it('for a surrounded group, returns a list with all the dead stones', function() {
    var dead_stone = new Stone(3, 2, Stone.BLACK);
    var other_dead_stone = new Stone(3, 3, Stone.BLACK);
    var dead_group = [dead_stone, other_dead_stone];
    var board = placeManyStones(new Board(19), [
      dead_stone, 
      other_dead_stone,
      new Stone(2, 2, Stone.WHITE),
      new Stone(3, 1, Stone.WHITE),
      new Stone(4, 2, Stone.WHITE),
      new Stone(4, 3, Stone.WHITE),
      new Stone(3, 4, Stone.WHITE),
      new Stone(2, 3, Stone.WHITE),
    ]);
    expect(Board.findDeadStones(board, [other_dead_stone])).to.have.members(dead_group);
  });

});
