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

var Board = function(board_size, grid, stones) {
  this.board_size = (board_size !== undefined) ? board_size : 19;
  this.grid = (grid !== undefined) ?
    grid : 
    Array.apply(
      null, 
      Array(this.board_size * this.board_size)
    ).map(function() { return null });
  return this;
  // this.stones = (stones !== undefined) ? stones : [];
};

Board.prototype.stoneAt = function(x, y) {
  if (this.coordinatesOutOfBounds(x, y)) { return undefined }
  return this.grid[this._coordinatesToIndex(x, y)];
};

Board.prototype.neighbors = function(x, y, filter) {
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

Board.prototype.coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

Board.placeStone = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }
  if (board.coordinatesOutOfBounds(new_stone.x, new_stone.y)) { return null }
  if (board.stoneAt(new_stone.x, new_stone.y)) { 
    return null;
  }

  return new Board(
    board.board_size,
    board.grid.map(function(stone, i) {
      return (i === board._coordinatesToIndex(new_stone.x, new_stone.y)) ? 
        new_stone :
        stone;
    }.bind(this))
  );
};

Board.findDeadStones = function(board, seed_stones) {
  var dead_groups = seed_stones.map(function(seed_stone) {
    var group = [seed_stone];
    var i = 0;

    while (group.length > i && (board.board_size * board.board_size) > group.length) {
      var this_stone = group[i];
      if (board.liberty(this_stone.x, this_stone.y)) { return [] }
      
      var friendly_neighbors = board.neighbors(this_stone.x, this_stone.y).filter(function(neighbor_stone) {
        return (
          this_stone.color === neighbor_stone.color &&
          !_.contains(group, neighbor_stone)
        );
      });
      group = group.concat(friendly_neighbors);      
      i = i + 1;
    }
    
    return group;
  })
  return _.compact(_.flatten(dead_groups));
}

Board.removeCaptures = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }

  // find neighboring stones that had liberty reduced ...
  var enemy_neighbors = board.neighbors(new_stone.x, new_stone.y).filter(function(neighbor_stone) {
    return (new_stone.color !== neighbor_stone.color);
  });  
  if (enemy_neighbors.length === 0) { return board }
  
  var dead_stones = Board.findDeadStones(board, enemy_neighbors);
  if (dead_stones.length === 0) { return board }
    
  var dead_stone_overlay = dead_stones.reduce(function(overlay, dead_stone) {
     overlay[board._coordinatesToIndex(dead_stone.x, dead_stone.y)] = true;
     return overlay;
  }, {});
    
  return new Board(
    board.board_size,
    board.grid.map(function(stone, i) {
      return (dead_stone_overlay[i]) ? null : stone;
    })
  );
};

Board.checkSuicide = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }
  if (!board.liberty(new_stone.x, new_stone.y)) { return null }
  return board;
};

module.exports = Board;
