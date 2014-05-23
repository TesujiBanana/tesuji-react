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
 
var Board = function(board_size, grid) {
  this.board_size = (board_size !== undefined) ? board_size : 19;
  this.grid = (grid !== undefined) ? 
    grid : 
    Array.apply(null, Array(this.board_size * this.board_size)).map(function() { return null });
  return this;
};

Board.prototype._coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

Board.prototype.stoneAt = function(x, y) {
  if (this._coordinatesOutOfBounds(x, y)) { return null }
  return this.grid[this._coordinatesToIndex(x, y)];
};

Board.prototype.placeStone = function(x, y, new_stone) {
  if (this._coordinatesOutOfBounds(x, y)) { return null }
  if (this.stoneAt(x, y)) { return null }
  
  return new Board(this.board_size, this.grid.map(function(stone, i) {
    return (i === this._coordinatesToIndex(x,y)) ? new_stone : stone 
  }.bind(this)));
};

module.exports = Board;
