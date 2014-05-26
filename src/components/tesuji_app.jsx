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
 *
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');

var Board = require('../models/board.js');
var Stone = require('../models/stone.js');
var BoardView = require('./board_view.jsx');

var TesujiApp = React.createClass({

  getInitialState: function() {
    return {
      board: new Board(),
      current_player: 0
    };
  },
  
  handleClick: function(payload) {
    if (!payload) { return }
    
    var x = payload.x;
    var y = payload.y;
    if (x === undefined || y === undefined) { return }
  
    var new_stone = new Stone(x, y, this.state.current_player);
    var new_board = _.compose(
      _.partial(Board.checkSuicide, _, new_stone),
      _.partial(Board.removeCaptures, _, new_stone),
      _.partial(Board.placeStone, _, new_stone)
    )(this.state.board);

    if (new_board !== null) {
      this.setState({
        board: new_board,
        current_player: (this.state.current_player + 1) % 2
      });
    }
  },
  
  render: function() {
    return (
      <BoardView boardSize="19" board={this.state.board} onIntersectionClick={this.handleClick}/>
    );
  }
});

module.exports = TesujiApp;
