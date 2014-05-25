require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var React = require('react');
var _ = require('underscore');

var BoardLabelView = React.createClass({displayName: 'BoardLabelView',
  propTypes: {
    board_size: React.PropTypes.number.isRequired
  },
  
  render: function() {
    return (
      React.DOM.div( {className:"tesuji-labels"}, 
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

module.exports = BoardLabelView;

},{"react":"M6d2gk","underscore":"ZKusGn"}],2:[function(require,module,exports){
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
 
var React = require('react');
var _ = require('underscore');

var Board = require('../models/board.js');

var GridView = require('./grid_view.jsx');
var BoardLabelView = require('./board_label_view.jsx');
var IntersectionView = require('./intersection_view.jsx');

var BoardView = React.createClass({displayName: 'BoardView',
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    board: React.PropTypes.instanceOf(Board).isRequired
  },
    
  render: function() {
    return(
      React.DOM.div( {className:"tesuji-board"}, 
        GridView( {board_size:this.props.board.board_size} ),
        BoardLabelView( {board_size:this.props.board.board_size} ),
        
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

},{"../models/board.js":7,"./board_label_view.jsx":1,"./grid_view.jsx":3,"./intersection_view.jsx":4,"react":"M6d2gk","underscore":"ZKusGn"}],3:[function(require,module,exports){
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

var GridView = React.createClass({displayName: 'GridView',
  propTypes: {
    board_size: React.PropTypes.number.isRequired
  },
  
  render: function() {
    return (
        React.DOM.table(null, React.DOM.tbody(null, 
          Array.apply(null, Array(this.props.board_size-1)).map(function(i) {
            return (
              React.DOM.tr( {key:i}, 
              Array.apply(null, Array(this.props.board_size-1)).map(function(j) {
                  return(
                    React.DOM.td( {key:j}, " ")
                  )
                })
              )
            );
          }.bind(this))
        ))

    );
  }
});

module.exports = GridView

},{"react":"M6d2gk","underscore":"ZKusGn"}],4:[function(require,module,exports){
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
    if (this.props.stone !== null) contents.push(StoneView( {stone:this.props.stone} ));
    
    return(
      React.DOM.div( {className:'intersection intersection-' + this.props.x + '-' + this.props.y,
        onClick:this._onClick}
      , contents)
    )
  }
});


var StoneView = React.createClass({displayName: 'StoneView',
  propTypes: {
    stone: React.PropTypes.instanceOf(Stone).isRequired
  },
  color: function() {
    console.log(this.props.stone.color);
    if (this.props.stone.color === Stone.BLACK) { return 'black' }
    if (this.props.stone.color === Stone.WHITE) { return 'white' }
  },
  render: function() {
    return (
      React.DOM.div( {className:'stone ' + this.color() })
    );
  }
});

module.exports = IntersectionView;

},{"../models/stone.js":8,"react":"M6d2gk"}],"tesuji_app":[function(require,module,exports){
module.exports=require('uovHxG');
},{}],"uovHxG":[function(require,module,exports){
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

},{"../models/board.js":7,"./board_view.jsx":2,"react":"M6d2gk"}],7:[function(require,module,exports){
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
 
var Stone = require('./stone');
var _ = require('underscore');

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

Board.prototype.stoneAt = function(x, y) {
  if (this.coordinatesOutOfBounds(x, y)) { return undefined }
  return this.grid[this._coordinatesToIndex(x, y)];
};

Board.prototype.neighbors = function(x, y) {
  return _.compact([
    this.stoneAt(x-1, y),
    this.stoneAt(x, y+1),
    this.stoneAt(x+1, y),
    this.stoneAt(x, y-1),
  ]);
};

Board.prototype.liberty = function(x, y) {
  return (
    this.stoneAt(x-1, y) === null ||
    this.stoneAt(x, y+1) === null ||
    this.stoneAt(x+1, y) === null ||
    this.stoneAt(x, y-1) === null
  );
};

Board.prototype.findDeadStones = function(seed_stones) {
  var cache = {};
  
  var dead_groups = seed_stones.forEach(function(seed_stone) {
    var group = [seed_stone];
    var i = 0;
    while (group.length > 0) {
      var this_stone = group[i];
      if (this.liberty(this_stone.x, this_stone.y)) { return [] }
      group.push(this.neighbors(this_stone.x, this_stone.y).filter(function(neighbor_stone) {
        return (this_stone.color === neighbor_stone.color);
      })); 
      
      i = i + 1;
    }
  }.bind(this));
  
  return _.flatten(_.compact(dead_groups));
}

Board.prototype.placeStone = function(x, y, color) {
  if (this.coordinatesOutOfBounds(x, y)) { return null }
  if (this.stoneAt(x, y)) { return null }
  
  // create new group from the new stone. liberty list is empty adjacent 
  // intersections.
  var new_board = new Board(
    this.board_size, 
    this.grid.map(function(stone, i) {
      return (i === this._coordinatesToIndex(x,y)) ? 
        new Stone(x, y, color) : 
        stone;
    }.bind(this))
  );

  // find dead stones
  var dead_stones = this.findDeadStones(this.neighbors(x,y));
  
  if (dead_stones.length > 0) {
    var dead_stone_overlay = dead_stones.reduce(function(overlay, dead_stone) {
       overlay[this._coordinatesToIndex(dead_stone.x, dead_stone.y)] = true;
       return overlay;
    }.bind(this), {});
    
    new_board = new Board(
      this.board_size,
      this.grid.filter(function(stone, i) {
          return !dead_stone_overlay[i];
      }.bind(this))
    );
  }
  
  // bleh ... 

  // groups for which the current location was a liberty and decrement liberty 
  // count.

  // remove enemy groups with zero liberties, updating liberty count for their
  // neighbors. (??? the 2nd part may be hard ... maybe we have to track 
  // neighboring enemy stones? or track/determine all neighboring spaces and 
  // this.stoneAt(...) to determine liberties)
  
  // check to make sure the new group is not in suicide.
    
  return new_board;
};

Board.prototype.coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

module.exports = Board;

},{"./stone":8,"underscore":"ZKusGn"}],8:[function(require,module,exports){
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
 
var _ = require('underscore');

var Stone = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
};

Stone.BLACK = 0;
Stone.WHITE = 1;

module.exports = Stone;

},{"underscore":"ZKusGn"}]},{},["uovHxG"])