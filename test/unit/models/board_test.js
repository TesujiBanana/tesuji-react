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
 
var expect = require('chai').expect;

var Board = require('../../../src/models/board.js'); 
var Stone = require('../../../src/models/stone.js'); 

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
    var empty_board = new Board()
    var board = empty_board.placeStone(3, 3, Stone.BLACK);
    expect(board.stoneAt(3, 3)).to.equal(Stone.BLACK)
  });
});

describe('.placeStone', function() {
  it('returns null for an out of bounds position', function() {
    var board = new Board();
    expect(board.placeStone(19, 19, Stone.BLACK)).to.be.null;
  });
  
  it('returns a new board for a valid move', function() {
    var board = new Board();
    var new_board = board.placeStone(3, 3, Stone.BLACK);
    expect(new_board).to.be.an.instanceof(Board);
    expect(new_board).to.not.equal(board);
  });
  
  it('removes a capture', function() {
    var board = new Board();
    var new_board = board.
      placeStone(3,2,0).placeStone().
      placeStone(2,2,1).placeStone().
      placeStone(3,1,1).placeStone().
      placeStone(4,2,1).placeStone().
      placeStone(3,3,1).placeStone();
    expect(new_board.stoneAt(3,2)).to.be.null;
  })
});
