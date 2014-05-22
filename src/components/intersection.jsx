/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Intersection = React.createClass({

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
    if (this.props.stone !== undefined) contents.push(<Stone color={this.props.stone === 0 ? 'black' : 'white'} />);
    
    return(
      <div className={'intersection intersection-' + this.props.x + '-' + this.props.y}
        onClick={this._onClick}
      >{contents}</div>
    )
  }
});


var Stone = React.createClass({
  render: function() {
    return (
      <div className={'stone ' + this.props.color}></div>
    );
  }
});

module.exports = Intersection;
