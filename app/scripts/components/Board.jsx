/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

// var React = require('react');
// var Grid = require('./Grid.jsx');


var BLACK = 0;
var WHITE = 1;

var BoardView = React.createClass({
  
  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },
  
  getDefaultProps: function() {
    return {
      board_size: 19,
      stones: []
    };
  },
  
  render: function() {
    return (
      <div className='tesuji-board'>
        <Grid board_size={this.props.board_size} stones={this.props.stones} onClick={this.props.onClick}/>
      </div>
    );
  }
});


// module.exports = Board
