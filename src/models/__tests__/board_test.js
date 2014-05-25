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
 
jest.dontMock('../board');

var Board = require('../board');

describe('new', function() {
  it('returns an object', function() {
    var board = new Board();
    expect(typeof board).toBe('object');
  });
  it('sets board_size to 19 by default', function() {
    var board = new Board();
    expect(board.board_size).toBe(19);
  });
});

describe('.stoneAt', function() {
  it('returns null for an empty position', function() {
    var board = new Board();
    expect(board.stoneAt(3, 3)).toBeNull();
  });
  
  it('returns the stone, if one has been placed', function() {
    var empty_board = new Board()
    var board = empty_board.placeStone(3, 3, 0);
    expect(board.stoneAt(3, 3)).toBe(0);
  });
});

describe('.placeStone', function() {
  it('returns null for an out of bounds position', function() {
    var board = new Board();
    expect(board.placeStone(19, 19, 0)).toBeNull();
  });
  
  it('returns a new board for a valid move', function() {
    var board = new Board();
    var new_board = board.placeStone(3, 3, 0);
    expect(typeof new_board).toBe('object');
    expect(new_board).not.toBe(board);
  });
  // 
  // it('removes a capture', function() {
  //   var board = new Board();
  //   var new_board = board.placeStone(3,2,0).placeStone()
  // })
});
