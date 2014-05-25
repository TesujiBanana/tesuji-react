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

var GridView = React.createClass({
  propTypes: {
    board_size: React.PropTypes.number.isRequired
  },
  
  render: function() {
    return (
      <div className='tesuji-grid'>
        <table><tbody>
          {_.times(this.props.board_size-1, function(i) {
            return (
              <tr key={i}>
                {_.times(this.props.board_size-1, function(j) {
                  return(
                    <td key={j}>&nbsp;</td>
                  )
                })}
              </tr>
            );
          }.bind(this))}
        </tbody></table>
        
        {_.times(this.props.board_size, function(i) {
          var label = "ABCDEFGHJKLMNOPQRST".charAt(i);
          return (<div className={'label-top-' + (i)} key={i}>{label}</div>)
        })}
        {_.times(this.props.board_size, function(i) {
          var label = "ABCDEFGHJKLMNOPQRST".charAt(i);
          return (<div className={'label-bottom-' + (i)} key={i}>{label}</div>)
        })}
        {_.times(this.props.board_size, function(i) {
          return (<div className={'label-left-' + (i)} key={i}>{i+1}</div>)
        })}
        {_.times(this.props.board_size, function(i) {
          return (<div className={'label-right-' + (i)} key={i}>{i+1}</div>)
        })}
      </div>
    );
  }
});

module.exports = GridView
