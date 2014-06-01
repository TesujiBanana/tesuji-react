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
  attributes: ['board_size', 'stones'],
  methods: {
    initialize: function(attributes) {
      return _.defaults(attributes, {
        board_size: 19,
        stones: []
      })
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
      return _.first(_.where(this.stones, {x: x, y: y})) || null;
    },

    neighbors: function(stone) {
      return [
        this.stoneAt(stone.x - 1, stone.y),
        this.stoneAt(stone.x, stone.y + 1),
        this.stoneAt(stone.x + 1, stone.y),
        this.stoneAt(stone.x, stone.y - 1)
      ];
    },

    getOverlay: function(new_stones) {
      var stones = (new_stones !== undefined) ? new_stones : this.stones;
      return _.object(
        stones.map(function(stone) {
          return stone.x + (this.board_size * stone.y);
        }.bind(this)),
        stones
      );
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

      return new Board({
        board_size: this.board_size,
        stones: _.values(_.extend({}, this.getOverlay(), this.getOverlay(valid_stones)))
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
  
      return new Board({
        board_size: this.board_size,
        stones: _.values(_.omit(this.getOverlay(), _.keys(this.getOverlay(valid_stones))))
      });
    },

    findKills: function(stone) {
      return _.reduce(
        this.neighbors(stone).filter(function(neighbor_stone) {
          return neighbor_stone && (stone.color !== neighbor_stone.color);
        }),
        function(dead_stones, seed_stone) {
          if (_.contains(dead_stones, seed_stone)) { return dead_stones }
          return dead_stones.concat(this.findDeadStones(seed_stone));
        }.bind(this),
        []
      );
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
