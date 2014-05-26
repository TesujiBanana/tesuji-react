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
var Stone = require('../models/stone.js');

var IntersectionView = React.createClass({

  _dot: function() {
    return (this.props.x % 6 === 3) && (this.props.y % 6 === 3)
  },

  _onClick: function() {
    this.props.onClick({
      x: this.props.x,
      y: this.props.y
    });
  },
  
  render: function() {
    var contents = []
    if (this._dot()) contents.push(<div className='dot'></div>);
    if (this.props.stone !== null) contents.push(<StoneView stone={this.props.stone} />);
    
    return(
      <div className={'intersection intersection-' + this.props.x + '-' + this.props.y}
        onClick={this._onClick}
      >{contents}</div>
    )
  }
});

var StoneView = React.createClass({
  propTypes: {
    stone: React.PropTypes.instanceOf(Stone).isRequired
  },
  color: function() {
    if (this.props.stone.color === Stone.BLACK) { return 'black' }
    if (this.props.stone.color === Stone.WHITE) { return 'white' }
  },
  render: function() {
    return (
      <div className={'stone ' + this.color() }></div>
    );
  }
});

module.exports = IntersectionView;
