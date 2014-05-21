/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

// var React = require('react');
// var Board = require('./Board.jsx');

var TesujiApp = React.createClass({

  getInitialState: function() {
    return {
      game_state: {
        board: _.times(19, function() { return [] }),
        current_player: 0
      }
    };
  },
  
  handleClick: function(payload) {
    var x = payload.x;
    var y = payload.y;
  
    // check whether arguments are even present ... 
    if (x === undefined || y === undefined) { return }
  
    // make sure there isn't already a stone there ... 
    if (this.state.game_state.board[x][y] !== undefined) { return }
    
    // we're good ... apparently ... create new game state ... 
    var new_game_state = {
      board: this.state.game_state.board.map(function(row) { return row.slice() }),
      current_player: (this.state.game_state.current_player + 1) % 2
    };
    
    // new board state with the proposed stone placed ...
    new_game_state.board[x][y] = this.state.game_state.current_player;
    // check north group
    // if (
    //   x > 0 && 
    //   new_game_state.board[x][y-1] !== undefined &&
    //   new_game_state.board[x][y-1] == this.game_state.current_player
    // ) {
    //   
    // }
    
    // new board state with captures removed ... 
    
    
    // check for suicide ...
    
    // check for ko ... 
    
    // if we made it this far, set new game state ...     
    this.setState({game_state: new_game_state});
  },
  
  render: function() {
    return (
      <BoardView boardSize="19" stones={this.state.game_state.board} onClick={this.handleClick}/>
    );
  }
});

var app = TesujiApp();
React.renderComponent(app, document.getElementById('tesuji_app'));



// module.exports = TesujiApp;
