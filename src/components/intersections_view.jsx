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

var Stone = require('../models/stone.js');

var IntersectionView = require('./intersection_view.jsx');

var IntersectionsView = React.createClass({
  getInitialState: function() {
    return {
      cursor_position: {
        x: 7,
        y: 8
      }
    }
  },

  onClick: function(event) {
    this.props.onIntersectionClick({
      x: this.state.cursor_position.x,
      y: this.state.cursor_position.y
    }, event);
  },

  onIntersectionEnter: function(payload, event) {
    this.setState({
      cursor_position: {
        x: payload.x,
        y: payload.y
      }
    });
  },

  render: function() {
    var board_size = 19;
    return (
      <div className='intersections' onClick={this.onClick}>
        {_.times( board_size * board_size, function(i) {
          var x = i % board_size;
          var y = (i - x) / board_size;
          var stone = this.props.board.stoneAt(x, y);
          var preview = (this.state.cursor_position.x === x && this.state.cursor_position.y === y) ?
            (this.props.current_turn === Stone.BLACK ? 'black' : 'white' ):
            undefined;

          return (
            <IntersectionView x={x} y={y} key={i}
              onMouseEnter={this.onIntersectionEnter}
              stone={stone}
              preview={preview} />
          )
        }.bind(this))}
      </div>
    );
  }
});

module.exports = IntersectionsView;
