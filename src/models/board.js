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
 
var Stone = require('./stone');
var _ = require('underscore');

var Board = function(board_size, grid) {
  this.board_size = (board_size !== undefined) ? board_size : 19;
  this.grid = (grid !== undefined) ?
    grid : 
    Array.apply(
      null, 
      Array(this.board_size * this.board_size)
    ).map(function() { return null });
  return this;
};

Board.prototype.stoneAt = function(x, y) {
  if (this.coordinatesOutOfBounds(x, y)) { return undefined }
  return this.grid[this._coordinatesToIndex(x, y)];
};

Board.prototype.neighbors = function(x, y) {
  return _.compact([
    this.stoneAt(x-1, y),
    this.stoneAt(x, y+1),
    this.stoneAt(x+1, y),
    this.stoneAt(x, y-1),
  ]);
};

Board.prototype.liberty = function(x, y) {
  return (
    this.stoneAt(x-1, y) === null ||
    this.stoneAt(x, y+1) === null ||
    this.stoneAt(x+1, y) === null ||
    this.stoneAt(x, y-1) === null
  );
};

Board.prototype.findDeadStones = function(seed_stones) {
  var cache = {};
  
  var dead_groups = seed_stones.forEach(function(seed_stone) {
    var group = [seed_stone];
    var i = 0;
    while (group.length > 0) {
      var this_stone = group[i];
      if (this.liberty(this_stone.x, this_stone.y)) { return [] }
      group.push(this.neighbors(this_stone.x, this_stone.y).filter(function(neighbor_stone) {
        return (this_stone.color === neighbor_stone.color);
      })); 
      
      i = i + 1;
    }
  }.bind(this));
  
  return _.flatten(_.compact(dead_groups));
}

Board.prototype.placeStone = function(x, y, color) {
  if (this.coordinatesOutOfBounds(x, y)) { return null }
  if (this.stoneAt(x, y)) { return null }
  
  // create new group from the new stone. liberty list is empty adjacent 
  // intersections.
  var new_board = new Board(
    this.board_size, 
    this.grid.map(function(stone, i) {
      return (i === this._coordinatesToIndex(x,y)) ? 
        new Stone(x, y, color) : 
        stone;
    }.bind(this))
  );

  // find dead stones
  var dead_stones = this.findDeadStones(this.neighbors(x,y));
  
  if (dead_stones.length > 0) {
    var dead_stone_overlay = dead_stones.reduce(function(overlay, dead_stone) {
       overlay[this._coordinatesToIndex(dead_stone.x, dead_stone.y)] = true;
       return overlay;
    }.bind(this), {});
    
    new_board = new Board(
      this.board_size,
      this.grid.filter(function(stone, i) {
          return !dead_stone_overlay[i];
      }.bind(this))
    );
  }
  
  // bleh ... 

  // groups for which the current location was a liberty and decrement liberty 
  // count.

  // remove enemy groups with zero liberties, updating liberty count for their
  // neighbors. (??? the 2nd part may be hard ... maybe we have to track 
  // neighboring enemy stones? or track/determine all neighboring spaces and 
  // this.stoneAt(...) to determine liberties)
  
  // check to make sure the new group is not in suicide.
    
  return new_board;
};

Board.prototype.coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

module.exports = Board;
