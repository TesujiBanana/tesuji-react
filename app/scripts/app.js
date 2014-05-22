require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var Grid = require('./grid.jsx');

var BLACK = 0;
var WHITE = 1;

var Board = React.createClass({displayName: 'Board',
  
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
      React.DOM.div( {className:"tesuji-board"}, 
        Grid( {board_size:this.props.board_size, stones:this.props.stones, onClick:this.props.onClick})
      )
    );
  }
});


module.exports = Board

},{"./grid.jsx":3,"react":"M6d2gk"}],2:[function(require,module,exports){
module.exports=require(1)
},{"./grid.jsx":3,"react":"M6d2gk"}],3:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');
var Intersection = require('./intersection.jsx');
 
var Grid = React.createClass({displayName: 'Grid',
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
      React.DOM.div( {className:"tesuji-grid", onClick:this.props.onClick}, 
        React.DOM.table(null, React.DOM.tbody(null, 
          _.times(this.props.board_size-1, function(i) {
            return (
              React.DOM.tr( {key:i}, 
                _.times(this.props.board_size-1, function(j) {
                  return(
                    React.DOM.td( {key:j}, " ")
                  )
                })
              )
            );
          }.bind(this))
        )),
        _.times(this.props.board_size, function(i) {
          var label = "ABCDEFGHJKLMNOPQRST".charAt(i);
          return (React.DOM.div( {className:'label-top-' + (i), key:i}, label))
        }),
        _.times(this.props.board_size, function(i) {
          var label = "ABCDEFGHJKLMNOPQRST".charAt(i);
          return (React.DOM.div( {className:'label-bottom-' + (i), key:i}, label))
        }),
        _.times(this.props.board_size, function(i) {
          return (React.DOM.div( {className:'label-left-' + (i), key:i}, i+1))
        }),
        _.times(this.props.board_size, function(i) {
          return (React.DOM.div( {className:'label-right-' + (i), key:i}, i+1))
        }),

        _.times(this.props.board_size * this.props.board_size, function(i) {
          var x = i % this.props.board_size;
          var y = (i - x) / this.props.board_size;
          return (
            Intersection( {x:x, y:y, key:i, onClick:this.props.onClick, stone:this.stoneAt(x,y)} )
          )
        }.bind(this))
      )

    );
  }
});

module.exports = Grid

},{"./intersection.jsx":4,"react":"M6d2gk","underscore":"ZKusGn"}],4:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Intersection = React.createClass({displayName: 'Intersection',

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
    if (this._dot()) contents.push(React.DOM.div( {className:"dot"}));
    if (this.props.stone !== undefined) contents.push(Stone( {color:this.props.stone === 0 ? 'black' : 'white'} ));
    
    return(
      React.DOM.div( {className:'intersection intersection-' + this.props.x + '-' + this.props.y,
        onClick:this._onClick}
      , contents)
    )
  }
});


var Stone = React.createClass({displayName: 'Stone',
  render: function() {
    return (
      React.DOM.div( {className:'stone ' + this.props.color})
    );
  }
});

module.exports = Intersection;

},{"react":"M6d2gk"}],"uu+T3n":[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');
var Board = require('./Board.jsx');

var TesujiApp = React.createClass({displayName: 'TesujiApp',

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
    
    // if we made it this far, set new game state ...     
    this.setState({game_state: new_game_state});
  },
  
  render: function() {
    return (
      Board( {boardSize:"19", stones:this.state.game_state.board, onClick:this.handleClick})
    );
  }
});

// React.renderComponent(TesujiApp(), document.getElementById('tesuji_app'));

module.exports = TesujiApp;

},{"./Board.jsx":1,"react":"M6d2gk","underscore":"ZKusGn"}],"tesuji_app":[function(require,module,exports){
module.exports=require('uu+T3n');
},{}]},{},[2,3,4,"uu+T3n"])