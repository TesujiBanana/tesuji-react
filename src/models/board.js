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

Board.findDeadStones = function(board, queue, group) {
  group = (group !== undefined) ? group : [];
  if (queue.length === 0) { return group }
  
  var stone = _.first(queue);
  var neighbors = Board.neighbors(board, stone);
  
  if (_.contains(neighbors, null)) { return [] }

  return Board.findDeadStones(board, 
    _.rest(queue).concat(neighbors.filter(function(neighbor_stone) {
      return (
        stone.color === neighbor_stone.color &&
        !_.contains(group, neighbor_stone)
      );
    })),
    group.concat(stone)
  );
}

Board.neighbors = function(board, stone) {
  return [
    board.stoneAt(stone.x - 1, stone.y),
    board.stoneAt(stone.x, stone.y + 1),
    board.stoneAt(stone.x + 1, stone.y),
    board.stoneAt(stone.x, stone.y - 1)
  ];
}

Board.removeCaptures = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }

  var dead_stones = _.reduce(
    Board.neighbors(board, new_stone).filter(function(neighbor_stone) {
      return neighbor_stone && (new_stone.color !== neighbor_stone.color);
    }),
    function(dead_stones, seed_stone) {
      if (_.contains(dead_stones, seed_stone)) { return dead_stones }
      return dead_stones.concat(Board.findDeadStones(board, [seed_stone]));
    },
    []
  );
  
  if (dead_stones.length === 0) { return board }

  var dead_stone_overlay = _.object(
    dead_stones.map(function(stone) { return board._coordinatesToIndex(stone.x, stone.y) }),
    dead_stones
  );

  return new Board(
    board.board_size,
    board.grid.map(function(stone, i) {
      return (dead_stone_overlay[i]) ? null : stone;
    })
  );
};

Board.checkSuicide = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }
  if (Board.findDeadStones(board, [new_stone]).length > 0) { return null }
  return board;
};

module.exports = Board;
