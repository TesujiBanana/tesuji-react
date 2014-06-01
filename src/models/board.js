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

var Board = Model.extend({
  attributes: ['board_size', 'grid'],
  methods: {
    initialize: function(attributes) {
      if (this.board_size === undefined) { this.board_size = 19 };
      if (this.grid === undefined) {
        this.grid = Array.apply(
          null, 
          Array(this.board_size * this.board_size)
        ).map(function() { return null });      
      }
    },
    
    _coordinatesToIndex: function(x, y) {
      return x + (this.board_size * y);
    },

    coordinatesOutOfBounds: function(x, y) {
      return (x < 0 || 
        x >= this.board_size || 
        y < 0 || 
        y >= this.board_size);
    },

    stoneAt: function(x, y) {
      if (this.coordinatesOutOfBounds(x, y)) { return undefined }
      return this.grid[this._coordinatesToIndex(x, y)];
    },

    neighbors: function(stone) {
      return [
        this.stoneAt(stone.x - 1, stone.y),
        this.stoneAt(stone.x, stone.y + 1),
        this.stoneAt(stone.x + 1, stone.y),
        this.stoneAt(stone.x, stone.y - 1)
      ];
    },

    placeStones: function() {
      args = _.flatten(arguments);
      var valid_stones = _.filter(args, function(stone) {
        return (
          !this.coordinatesOutOfBounds(stone.x, stone.y) &&
          !this.stoneAt(stone.x, stone.y)
        );
      }.bind(this));
      
      if (valid_stones.length === 0) { return null }
      
      var overlay = _.object(
        valid_stones.map(function(stone) { return this._coordinatesToIndex(stone.x, stone.y) }.bind(this)),
        valid_stones
      );
      
      return new Board({
        board_size: this.board_size,
        grid: this.grid.map(function(stone, i) {
          return (overlay[i]) ? overlay[i] : stone;
        })
      });
    },

    removeStones: function() {
      args = _.flatten(arguments);
      var valid_stones = _.filter(args, function(stone) {
        return (
          !this.coordinatesOutOfBounds(stone.x, stone.y) &&
          stone === this.stoneAt(stone.x, stone.y)
        );
      }.bind(this));
      
      if (valid_stones.length === 0) { return this }
      
      var overlay = _.object(
        valid_stones.map(function(stone) { return this._coordinatesToIndex(stone.x, stone.y) }.bind(this)),
        valid_stones
      );
      
      return new Board({
        board_size: this.board_size,
        grid: this.grid.map(function(stone, i) {
          return (overlay[i]) ? null : stone;
        })
      });
    },

    findDeadStones: function(stone) {
      return (function _findDeadStones(board, queue, group) {
        // if there is nothing left to check, we are dead.
        if (queue.length === 0) { return group }
        
        var stone = queue[0];
        var neighbors = board.neighbors(stone);

        // if we find a null (empty) neighbor, we are alive.
        if (neighbors.indexOf(null) >= 0) { return [] }

        // enqueue friendly neighbors, add stone to group, and call self.
        return _findDeadStones(board, 
          queue.slice(1).concat(neighbors.filter(function(neighbor_stone) {
            return (
              (neighbor_stone && stone.color === neighbor_stone.color) &&
              !_.contains(group, neighbor_stone)
            );
          })),
          group.concat(stone)
        );
      })(this, [stone], []);
    }
  }
});

module.exports = Board;
