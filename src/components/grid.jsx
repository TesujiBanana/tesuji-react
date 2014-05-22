/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');
var Intersection = require('./intersection.jsx');
 
var Grid = React.createClass({
  getDefaultProps: function() {
    return {
      board_size: 19
    };
  },
  
  stoneAt: function(x, y) {
    if (typeof this.props.stones === 'undefined') { return undefined }
    else if (typeof this.props.stones[x] === 'undefined') { return undefined }
    else { return this.props.stones[x][y] }
  },

  render: function() {
    return (
      <div className='tesuji-grid' onClick={this.props.onClick}>
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

        {_.times(this.props.board_size * this.props.board_size, function(i) {
          var x = i % this.props.board_size;
          var y = (i - x) / this.props.board_size;
          return (
            <Intersection x={x} y={y} key={i} onClick={this.props.onClick} stone={this.stoneAt(x,y)} />
          )
        }.bind(this))}
      </div>

    );
  }
});

module.exports = Grid
