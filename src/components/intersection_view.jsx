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

var StoneView = require('./stone_view.jsx');

var IntersectionView = React.createClass({

  onMouseEnter: function(event) {
    this.props.onMouseEnter({
      x: this.props.x,
      y: this.props.y
    }, event);
  },

  render: function() {
    var contents = [];
    if (this.props.stone) {
      contents.push(<StoneView stone={this.props.stone} key='stone' />);
    }
    else if (this.props.preview) {
      contents.push(<div className={'stone preview ' + this.props.preview } key='preview' />);
    }
    return(
      <div className={'intersection intersection-' + this.props.x + '-' + this.props.y}
        onMouseEnter={this.onMouseEnter}>
        {contents}
      </div>
    )
  }
});


module.exports = IntersectionView;
