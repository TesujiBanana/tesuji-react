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

var Board = require('../../../src/models/board.js');

var Stone = require('../../../src/models/stone.js'); 

describe('Board', function() {
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
      var board = empty_board.placeStones(new Stone({x: 3, y: 3, color: Stone.BLACK}));
      expect(board.stoneAt(3, 3).color).to.equal(Stone.BLACK);
    });
  });


  describe('.placeStones', function() {
    it('returns null if attempting to place a stone out of bounds', function() {
      var board = new Board();
      expect(board.placeStones(new Stone({x: 19, y: 19, color: Stone.BLACK}))).to.be.null;
    });
    
    it('returns a new board for a valid move', function() {
      var board = new Board();
      var new_board = board.placeStones(new Stone({x: 3, y: 3, color: Stone.BLACK}));
      expect(new_board).to.be.an.instanceOf(Board);
      expect(new_board).to.not.equal(board);
    });
    
    it('can place a single stone', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = (new Board()).placeStones(stone);
      expect(board.stoneAt(3, 3)).to.eql(stone);
    });

    it('can place two stones', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var another_stone = new Stone({x: 2, y: 5, color: Stone.BLACK});
      var board = (new Board()).placeStones(stone, another_stone);
      expect(board.stoneAt(3, 3)).to.eql(stone);
      expect(board.stoneAt(2, 5)).to.eql(another_stone);
    });
  });

  describe('.removeStones', function() {
    it('does nothing if no stones are being removed', function() {
      var board = new Board();
      var new_board = board.removeStones(new Stone({x: 3, y: 3, color: Stone.BLACK}));
      expect(board).to.eql(new_board);
    });
    
    it('returns a new board if stones were removed', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = (new Board()).placeStones(stone);
      var new_board = board.removeStones(stone);
      expect(new_board).to.be.instanceOf(Board);
      expect(new_board).to.not.equal(board);
    });
    
    it('can remove a single stone', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = (new Board()).placeStones(stone).removeStones(stone);
      expect(board.stoneAt(3, 3)).to.be.null;
    });
    
    it('can remove a single stone from a board with 2 stones', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var dead_stone = new Stone({x: 2, y: 3, color: Stone.WHITE});
      var board = (new Board()).placeStones(stone, dead_stone).removeStones(dead_stone);
      expect(board.stoneAt(3, 3)).to.eql(stone);
      expect(board.stoneAt(2, 3)).to.be.null;
    });
    
    it('can take an array as well as an args list', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var dead_stone = new Stone({x: 2, y: 3, color: Stone.WHITE});
      var board = (new Board()).placeStones(stone, dead_stone).removeStones([dead_stone]);
      expect(board.stoneAt(3, 3)).to.eql(stone);
      expect(board.stoneAt(2, 3)).to.be.null;
    });
  });

  describe('.findDeadStones', function() {
    it('returns nothing for a lone stone in the center of the board', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = (new Board()).placeStones(stone);
      expect(board.findDeadStones(stone)).to.eql([]);
    });
    
    it('for a lone surrounded stone, returns a list with the dead stone', function() {
      var dead_stone = new Stone({x: 3, y: 2, color: Stone.BLACK});
      var board = (new Board()).placeStones(
        dead_stone, 
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 3, color: Stone.WHITE})
      );
      expect(board.findDeadStones(dead_stone)).to.eql([dead_stone]); 
    });

    it('for a surrounded group, returns a list with all the dead stones', function() {
      var dead_stone = new Stone({x: 3, y: 2, color: Stone.BLACK});
      var other_dead_stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var dead_group = [dead_stone, other_dead_stone];
      var board = (new Board()).placeStones(
        dead_stone, 
        other_dead_stone,
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 4, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 4, color: Stone.WHITE}),
        new Stone({x: 2, y: 3, color: Stone.WHITE})
      );
      expect(board.findDeadStones(other_dead_stone)).to.have.members(dead_group);
    });
    
    it('can find dead stones on the edge', function() {
      var dead_stones = [
        new Stone({x: 18, y: 8, color: Stone.BLACK}),
        new Stone({x: 18, y: 9, color: Stone.BLACK}),
        new Stone({x: 18, y: 10, color: Stone.BLACK})
      ];
      var board = (new Board()).placeStones(
        dead_stones.concat(
          new Stone({x: 18, y: 7, color: Stone.WHITE}),
          new Stone({x: 17, y: 8, color: Stone.WHITE}),
          new Stone({x: 17, y: 9, color: Stone.WHITE}),
          new Stone({x: 17, y: 10, color: Stone.WHITE}),
          new Stone({x: 18, y: 11, color: Stone.WHITE})
        )
      );
      expect(board.findDeadStones(dead_stones[0])).to.have.members(dead_stones);
    });
  });
});
