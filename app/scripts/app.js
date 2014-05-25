require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');

var Board = require('../models/board.js');

var GridView = require('./grid_view.jsx');
var IntersectionView = require('./intersection_view.jsx');


var BoardView = React.createClass({displayName: 'BoardView',
  
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    board: React.PropTypes.instanceOf(Board).isRequired
  },
    
  render: function() {
    return(
      React.DOM.div( {className:"tesuji-board", onClick:this.props.onClick}, 
        GridView( {board_size:this.props.board.board_size} ),

        _.times(this.props.board.board_size * this.props.board.board_size, function(i) {
          var x = i % this.props.board.board_size;
          var y = (i - x) / this.props.board.board_size;
          return (
            IntersectionView( {x:x, y:y, key:i, onClick:this.props.onClick, stone:this.props.board.stoneAt(x,y)} )
          )
        }.bind(this))
      )
    );
  }
});


module.exports = BoardView;

},{"../models/board.js":6,"./grid_view.jsx":2,"./intersection_view.jsx":3,"react":"M6d2gk","underscore":"ZKusGn"}],2:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore'); 

var GridView = React.createClass({displayName: 'GridView',
  propTypes: {
    board_size: React.PropTypes.number.isRequired
  },
  
  render: function() {
    return (
      React.DOM.div( {className:"tesuji-grid"}, 
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
        })
      )
    );
  }
});

module.exports = GridView

},{"react":"M6d2gk","underscore":"ZKusGn"}],3:[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Stone = require('../models/stone.js');

var IntersectionView = React.createClass({displayName: 'IntersectionView',

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
    if (this.props.stone !== null) contents.push(StoneView( {color:this.props.stone === Stone.BLACK ? 'black' : 'white'} ));
    
    return(
      React.DOM.div( {className:'intersection intersection-' + this.props.x + '-' + this.props.y,
        onClick:this._onClick}
      , contents)
    )
  }
});


var StoneView = React.createClass({displayName: 'StoneView',
  render: function() {
    return (
      React.DOM.div( {className:'stone ' + this.props.color})
    );
  }
});

module.exports = IntersectionView;

},{"../models/stone.js":7,"react":"M6d2gk"}],"tesuji_app":[function(require,module,exports){
module.exports=require('uovHxG');
},{}],"uovHxG":[function(require,module,exports){
/**
 * Copyright 2014 Chris Papazian
 * 
 * @jsx React.DOM
 */
 
'use strict';

var React = require('react');
var _ = require('underscore');
var Board = require('../models/board.js');
var BoardView = require('./board_view.jsx');

var TesujiApp = React.createClass({displayName: 'TesujiApp',

  getInitialState: function() {
    return {
      board: new Board(),
      current_player: 0
    };
  },
  
  handleClick: function(payload) {
    var x = payload.x;
    var y = payload.y;
  
    // check whether arguments are even present ... 
    if (x === undefined || y === undefined) { return }
  
    
    var new_board = this.state.board.placeStone(x, y, this.state.current_player);
    if (new_board !== null) {
      this.setState({
        board: new_board,
        current_player: (this.state.current_player + 1) % 2
      });
    }
  },
  
  render: function() {
    return (
      BoardView( {boardSize:"19", board:this.state.board, onClick:this.handleClick})
    );
  }
});

module.exports = TesujiApp;

},{"../models/board.js":6,"./board_view.jsx":1,"react":"M6d2gk","underscore":"ZKusGn"}],6:[function(require,module,exports){
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
 */
 
var Board = function(board_size, grid) {
  this.board_size = (board_size !== undefined) ? board_size : 19;
  this.grid = (grid !== undefined) ?
    grid : 
    Array.apply(
      null, 
      Array(this.board_size * this.board_size)
    ).map(function() { return null });
  return this;
};

Board.prototype._coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

Board.prototype.stoneAt = function(x, y) {
  if (this._coordinatesOutOfBounds(x, y)) { return null }
  return this.grid[this._coordinatesToIndex(x, y)];
};

// TODO: rename this method ... 
Board.prototype.placeStone = function(x, y, new_stone) {
  if (this._coordinatesOutOfBounds(x, y)) { return null }
  if (this.stoneAt(x, y)) { return null }
  
  // var dead_stones = this._detectDeadStones
  
  return new Board(
    this.board_size, 
    this.grid.map(function(stone, i) {
      return (i === this._coordinatesToIndex(x,y)) ? 
        new_stone : 
        stone;
    }.bind(this))
  );
};

module.exports = Board;

},{}],7:[function(require,module,exports){
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
 */
 
var Stone = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  return this.freeze();
};

Stone.BLACK = 0;
Stone.WHITE = 1;

module.exports = Stone;

},{}]},{},["uovHxG"])