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
var _ = require('underscore');

var Board = require('../models/board.js');
var Stone = require('../models/stone.js');
var BoardView = require('./board_view.jsx');

var TesujiApp = React.createClass({displayName: 'TesujiApp',

  getInitialState: function() {
    return {
      board: new Board(),
      current_player: 0
    };
  },
  
  handleClick: function(payload) {
    if (!payload) { return }
    
    var x = payload.x;
    var y = payload.y;
    if (x === undefined || y === undefined) { return }
  
    var new_stone = new Stone(x, y, this.state.current_player);
    var new_board = _.compose(
      _.partial(Board.removeCaptures, _, new_stone),
      _.partial(Board.placeStone, _, new_stone)
    )(this.state.board);

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

},{"../models/board.js":7,"../models/stone.js":8,"./board_view.jsx":2,"react":"M6d2gk","underscore":"ZKusGn"}],7:[function(require,module,exports){
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

Board.prototype.neighbors = function(x, y, filter) {
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

Board.prototype.coordinatesOutOfBounds = function(x, y) {
  return (x < 0 || 
    x >= this.board_size || 
    y < 0 || 
    y >= this.board_size);
};

Board.prototype._coordinatesToIndex = function(x, y) {
  return x + (this.board_size * y);
};

Board.placeStone = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }
  if (board.coordinatesOutOfBounds(new_stone.x, new_stone.y)) { return null }
  if (board.stoneAt(new_stone.x, new_stone.y)) { 
    return null;
  }

  return new Board(
    board.board_size,
    board.grid.map(function(stone, i) {
      return (i === board._coordinatesToIndex(new_stone.x, new_stone.y)) ? 
        new_stone :
        stone;
    }.bind(this))
  );
};

Board.findDeadStones = function(board, seed_stones) {
  var dead_groups = seed_stones.map(function(seed_stone) {
    var group = [seed_stone];
    var i = 0;

    while (group.length > i && (board.board_size * board.board_size) > group.length) {
      var this_stone = group[i];
      if (board.liberty(this_stone.x, this_stone.y)) { return [] }
      
      var friendly_neighbors = board.neighbors(this_stone.x, this_stone.y).filter(function(neighbor_stone) {
        return (
          this_stone.color === neighbor_stone.color &&
          !_.contains(group, neighbor_stone)
        );
      });
      group = group.concat(friendly_neighbors);      
      i = i + 1;
    }
    
    return group;
  })
  return _.compact(_.flatten(dead_groups));
}

Board.removeCaptures = function(board, new_stone) {
  if (board === null || new_stone === null) { return null }

  // find neighboring stones that had liberty reduced ...
  var enemy_neighbors = board.neighbors(new_stone.x, new_stone.y).filter(function(neighbor_stone) {
    return (new_stone.color !== neighbor_stone.color);
  });  
  if (enemy_neighbors.length === 0) { return board }
  
  var dead_stones = Board.findDeadStones(board, enemy_neighbors);
  if (dead_stones.length === 0) { return board }
    
  var dead_stone_overlay = dead_stones.reduce(function(overlay, dead_stone) {
     overlay[board._coordinatesToIndex(dead_stone.x, dead_stone.y)] = true;
     return overlay;
  }, {});
    
  return new Board(
    board.board_size,
    board.grid.map(function(stone, i) {
      return (dead_stone_overlay[i]) ? null : stone;
    })
  );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvcGFwYXppYW4vcHJvamVjdHMvdGVzdWppLXJlYWN0L25vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3BhcGF6aWFuL3Byb2plY3RzL3Rlc3VqaS1yZWFjdC9zcmMvY29tcG9uZW50cy9ib2FyZF9sYWJlbF92aWV3LmpzeCIsIi9Vc2Vycy9wYXBhemlhbi9wcm9qZWN0cy90ZXN1amktcmVhY3Qvc3JjL2NvbXBvbmVudHMvYm9hcmRfdmlldy5qc3giLCIvVXNlcnMvcGFwYXppYW4vcHJvamVjdHMvdGVzdWppLXJlYWN0L3NyYy9jb21wb25lbnRzL2dyaWRfdmlldy5qc3giLCIvVXNlcnMvcGFwYXppYW4vcHJvamVjdHMvdGVzdWppLXJlYWN0L3NyYy9jb21wb25lbnRzL2ludGVyc2VjdGlvbl92aWV3LmpzeCIsIi9Vc2Vycy9wYXBhemlhbi9wcm9qZWN0cy90ZXN1amktcmVhY3Qvc3JjL2NvbXBvbmVudHMvdGVzdWppX2FwcC5qc3giLCIvVXNlcnMvcGFwYXppYW4vcHJvamVjdHMvdGVzdWppLXJlYWN0L3NyYy9tb2RlbHMvYm9hcmQuanMiLCIvVXNlcnMvcGFwYXppYW4vcHJvamVjdHMvdGVzdWppLXJlYWN0L3NyYy9tb2RlbHMvc3RvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQ2hyaXMgUGFwYXppYW5cbiAqIFxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG52YXIgQm9hcmRMYWJlbFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdCb2FyZExhYmVsVmlldycsXG4gIHByb3BUeXBlczoge1xuICAgIGJvYXJkX3NpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICB9LFxuICBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInRlc3VqaS1sYWJlbHNcIn0sIFxuICAgICAgICBfLnRpbWVzKHRoaXMucHJvcHMuYm9hcmRfc2l6ZSwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgIHZhciBsYWJlbCA9IFwiQUJDREVGR0hKS0xNTk9QUVJTVFwiLmNoYXJBdChpKTtcbiAgICAgICAgICByZXR1cm4gKFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6J2xhYmVsLXRvcC0nICsgKGkpLCBrZXk6aX0sIGxhYmVsKSlcbiAgICAgICAgfSksXG4gICAgICAgIF8udGltZXModGhpcy5wcm9wcy5ib2FyZF9zaXplLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgdmFyIGxhYmVsID0gXCJBQkNERUZHSEpLTE1OT1BRUlNUXCIuY2hhckF0KGkpO1xuICAgICAgICAgIHJldHVybiAoUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTonbGFiZWwtYm90dG9tLScgKyAoaSksIGtleTppfSwgbGFiZWwpKVxuICAgICAgICB9KSxcbiAgICAgICAgXy50aW1lcyh0aGlzLnByb3BzLmJvYXJkX3NpemUsIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICByZXR1cm4gKFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6J2xhYmVsLWxlZnQtJyArIChpKSwga2V5Oml9LCBpKzEpKVxuICAgICAgICB9KSxcbiAgICAgICAgXy50aW1lcyh0aGlzLnByb3BzLmJvYXJkX3NpemUsIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICByZXR1cm4gKFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6J2xhYmVsLXJpZ2h0LScgKyAoaSksIGtleTppfSwgaSsxKSlcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZExhYmVsVmlldztcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQ2hyaXMgUGFwYXppYW5cbiAqIFxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cbiBcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIEJvYXJkID0gcmVxdWlyZSgnLi4vbW9kZWxzL2JvYXJkLmpzJyk7XG5cbnZhciBHcmlkVmlldyA9IHJlcXVpcmUoJy4vZ3JpZF92aWV3LmpzeCcpO1xudmFyIEJvYXJkTGFiZWxWaWV3ID0gcmVxdWlyZSgnLi9ib2FyZF9sYWJlbF92aWV3LmpzeCcpO1xudmFyIEludGVyc2VjdGlvblZpZXcgPSByZXF1aXJlKCcuL2ludGVyc2VjdGlvbl92aWV3LmpzeCcpO1xuXG52YXIgQm9hcmRWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnQm9hcmRWaWV3JyxcbiAgcHJvcFR5cGVzOiB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBib2FyZDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoQm9hcmQpLmlzUmVxdWlyZWRcbiAgfSxcbiAgICBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwidGVzdWppLWJvYXJkXCJ9LCBcbiAgICAgICAgR3JpZFZpZXcoIHtib2FyZF9zaXplOnRoaXMucHJvcHMuYm9hcmQuYm9hcmRfc2l6ZX0gKSxcbiAgICAgICAgQm9hcmRMYWJlbFZpZXcoIHtib2FyZF9zaXplOnRoaXMucHJvcHMuYm9hcmQuYm9hcmRfc2l6ZX0gKSxcbiAgICAgICAgXG4gICAgICAgIF8udGltZXModGhpcy5wcm9wcy5ib2FyZC5ib2FyZF9zaXplICogdGhpcy5wcm9wcy5ib2FyZC5ib2FyZF9zaXplLCBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgdmFyIHggPSBpICUgdGhpcy5wcm9wcy5ib2FyZC5ib2FyZF9zaXplO1xuICAgICAgICAgIHZhciB5ID0gKGkgLSB4KSAvIHRoaXMucHJvcHMuYm9hcmQuYm9hcmRfc2l6ZTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgSW50ZXJzZWN0aW9uVmlldygge3g6eCwgeTp5LCBrZXk6aSwgb25DbGljazp0aGlzLnByb3BzLm9uQ2xpY2ssIHN0b25lOnRoaXMucHJvcHMuYm9hcmQuc3RvbmVBdCh4LHkpfSApXG4gICAgICAgICAgKVxuICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgIFxuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZFZpZXc7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IENocmlzIFBhcGF6aWFuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4gXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIEdyaWRWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnR3JpZFZpZXcnLFxuICBwcm9wVHlwZXM6IHtcbiAgICBib2FyZF9zaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLnRhYmxlKG51bGwsIFJlYWN0LkRPTS50Ym9keShudWxsLCBcbiAgICAgICAgICBBcnJheS5hcHBseShudWxsLCBBcnJheSh0aGlzLnByb3BzLmJvYXJkX3NpemUtMSkpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBSZWFjdC5ET00udHIoIHtrZXk6aX0sIFxuICAgICAgICAgICAgICBBcnJheS5hcHBseShudWxsLCBBcnJheSh0aGlzLnByb3BzLmJvYXJkX3NpemUtMSkpLm1hcChmdW5jdGlvbihqKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LkRPTS50ZCgge2tleTpqfSwgXCLCoFwiKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICApKVxuXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZFZpZXdcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQ2hyaXMgUGFwYXppYW5cbiAqIFxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFN0b25lID0gcmVxdWlyZSgnLi4vbW9kZWxzL3N0b25lLmpzJyk7XG5cbnZhciBJbnRlcnNlY3Rpb25WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnSW50ZXJzZWN0aW9uVmlldycsXG5cbiAgX2RvdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLnByb3BzLnggJSA2ID09PSAzKSAmJiAodGhpcy5wcm9wcy55ICUgNiA9PT0gMylcbiAgfSxcblxuICBfb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKHtcbiAgICAgIHg6IHRoaXMucHJvcHMueCxcbiAgICAgIHk6IHRoaXMucHJvcHMueVxuICAgIH0pO1xuICB9LFxuICBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGVudHMgPSBbXVxuICAgIGlmICh0aGlzLl9kb3QoKSkgY29udGVudHMucHVzaChSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiZG90XCJ9KSk7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RvbmUgIT09IG51bGwpIGNvbnRlbnRzLnB1c2goU3RvbmVWaWV3KCB7c3RvbmU6dGhpcy5wcm9wcy5zdG9uZX0gKSk7XG4gICAgXG4gICAgcmV0dXJuKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTonaW50ZXJzZWN0aW9uIGludGVyc2VjdGlvbi0nICsgdGhpcy5wcm9wcy54ICsgJy0nICsgdGhpcy5wcm9wcy55LFxuICAgICAgICBvbkNsaWNrOnRoaXMuX29uQ2xpY2t9XG4gICAgICAsIGNvbnRlbnRzKVxuICAgIClcbiAgfVxufSk7XG5cbnZhciBTdG9uZVZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdTdG9uZVZpZXcnLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdG9uZTogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoU3RvbmUpLmlzUmVxdWlyZWRcbiAgfSxcbiAgY29sb3I6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0b25lLmNvbG9yID09PSBTdG9uZS5CTEFDSykgeyByZXR1cm4gJ2JsYWNrJyB9XG4gICAgaWYgKHRoaXMucHJvcHMuc3RvbmUuY29sb3IgPT09IFN0b25lLldISVRFKSB7IHJldHVybiAnd2hpdGUnIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTonc3RvbmUgJyArIHRoaXMuY29sb3IoKSB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyc2VjdGlvblZpZXc7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IENocmlzIFBhcGF6aWFuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG4gXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIEJvYXJkID0gcmVxdWlyZSgnLi4vbW9kZWxzL2JvYXJkLmpzJyk7XG52YXIgU3RvbmUgPSByZXF1aXJlKCcuLi9tb2RlbHMvc3RvbmUuanMnKTtcbnZhciBCb2FyZFZpZXcgPSByZXF1aXJlKCcuL2JvYXJkX3ZpZXcuanN4Jyk7XG5cbnZhciBUZXN1amlBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdUZXN1amlBcHAnLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJvYXJkOiBuZXcgQm9hcmQoKSxcbiAgICAgIGN1cnJlbnRfcGxheWVyOiAwXG4gICAgfTtcbiAgfSxcbiAgXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaWYgKCFwYXlsb2FkKSB7IHJldHVybiB9XG4gICAgXG4gICAgdmFyIHggPSBwYXlsb2FkLng7XG4gICAgdmFyIHkgPSBwYXlsb2FkLnk7XG4gICAgaWYgKHggPT09IHVuZGVmaW5lZCB8fCB5ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIH1cbiAgXG4gICAgdmFyIG5ld19zdG9uZSA9IG5ldyBTdG9uZSh4LCB5LCB0aGlzLnN0YXRlLmN1cnJlbnRfcGxheWVyKTtcbiAgICB2YXIgbmV3X2JvYXJkID0gXy5jb21wb3NlKFxuICAgICAgXy5wYXJ0aWFsKEJvYXJkLnJlbW92ZUNhcHR1cmVzLCBfLCBuZXdfc3RvbmUpLFxuICAgICAgXy5wYXJ0aWFsKEJvYXJkLnBsYWNlU3RvbmUsIF8sIG5ld19zdG9uZSlcbiAgICApKHRoaXMuc3RhdGUuYm9hcmQpO1xuXG4gICAgaWYgKG5ld19ib2FyZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGJvYXJkOiBuZXdfYm9hcmQsXG4gICAgICAgIGN1cnJlbnRfcGxheWVyOiAodGhpcy5zdGF0ZS5jdXJyZW50X3BsYXllciArIDEpICUgMlxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgQm9hcmRWaWV3KCB7Ym9hcmRTaXplOlwiMTlcIiwgYm9hcmQ6dGhpcy5zdGF0ZS5ib2FyZCwgb25DbGljazp0aGlzLmhhbmRsZUNsaWNrfSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN1amlBcHA7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IENocmlzIFBhcGF6aWFuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuIFxudmFyIFN0b25lID0gcmVxdWlyZSgnLi9zdG9uZScpO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbnZhciBCb2FyZCA9IGZ1bmN0aW9uKGJvYXJkX3NpemUsIGdyaWQpIHtcbiAgdGhpcy5ib2FyZF9zaXplID0gKGJvYXJkX3NpemUgIT09IHVuZGVmaW5lZCkgPyBib2FyZF9zaXplIDogMTk7XG4gIHRoaXMuZ3JpZCA9IChncmlkICE9PSB1bmRlZmluZWQpID9cbiAgICBncmlkIDogXG4gICAgQXJyYXkuYXBwbHkoXG4gICAgICBudWxsLCBcbiAgICAgIEFycmF5KHRoaXMuYm9hcmRfc2l6ZSAqIHRoaXMuYm9hcmRfc2l6ZSlcbiAgICApLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuQm9hcmQucHJvdG90eXBlLnN0b25lQXQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIGlmICh0aGlzLmNvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeCwgeSkpIHsgcmV0dXJuIHVuZGVmaW5lZCB9XG4gIHJldHVybiB0aGlzLmdyaWRbdGhpcy5fY29vcmRpbmF0ZXNUb0luZGV4KHgsIHkpXTtcbn07XG5cbkJvYXJkLnByb3RvdHlwZS5uZWlnaGJvcnMgPSBmdW5jdGlvbih4LCB5LCBmaWx0ZXIpIHtcbiAgcmV0dXJuIF8uY29tcGFjdChbXG4gICAgdGhpcy5zdG9uZUF0KHgtMSwgeSksXG4gICAgdGhpcy5zdG9uZUF0KHgsIHkrMSksXG4gICAgdGhpcy5zdG9uZUF0KHgrMSwgeSksXG4gICAgdGhpcy5zdG9uZUF0KHgsIHktMSksXG4gIF0pO1xufTtcblxuQm9hcmQucHJvdG90eXBlLmxpYmVydHkgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiAoXG4gICAgdGhpcy5zdG9uZUF0KHgtMSwgeSkgPT09IG51bGwgfHxcbiAgICB0aGlzLnN0b25lQXQoeCwgeSsxKSA9PT0gbnVsbCB8fFxuICAgIHRoaXMuc3RvbmVBdCh4KzEsIHkpID09PSBudWxsIHx8XG4gICAgdGhpcy5zdG9uZUF0KHgsIHktMSkgPT09IG51bGxcbiAgKTtcbn07XG5cbkJvYXJkLnByb3RvdHlwZS5jb29yZGluYXRlc091dE9mQm91bmRzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gKHggPCAwIHx8IFxuICAgIHggPj0gdGhpcy5ib2FyZF9zaXplIHx8IFxuICAgIHkgPCAwIHx8IFxuICAgIHkgPj0gdGhpcy5ib2FyZF9zaXplKTtcbn07XG5cbkJvYXJkLnByb3RvdHlwZS5fY29vcmRpbmF0ZXNUb0luZGV4ID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4geCArICh0aGlzLmJvYXJkX3NpemUgKiB5KTtcbn07XG5cbkJvYXJkLnBsYWNlU3RvbmUgPSBmdW5jdGlvbihib2FyZCwgbmV3X3N0b25lKSB7XG4gIGlmIChib2FyZCA9PT0gbnVsbCB8fCBuZXdfc3RvbmUgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuICBpZiAoYm9hcmQuY29vcmRpbmF0ZXNPdXRPZkJvdW5kcyhuZXdfc3RvbmUueCwgbmV3X3N0b25lLnkpKSB7IHJldHVybiBudWxsIH1cbiAgaWYgKGJvYXJkLnN0b25lQXQobmV3X3N0b25lLngsIG5ld19zdG9uZS55KSkgeyBcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBuZXcgQm9hcmQoXG4gICAgYm9hcmQuYm9hcmRfc2l6ZSxcbiAgICBib2FyZC5ncmlkLm1hcChmdW5jdGlvbihzdG9uZSwgaSkge1xuICAgICAgcmV0dXJuIChpID09PSBib2FyZC5fY29vcmRpbmF0ZXNUb0luZGV4KG5ld19zdG9uZS54LCBuZXdfc3RvbmUueSkpID8gXG4gICAgICAgIG5ld19zdG9uZSA6XG4gICAgICAgIHN0b25lO1xuICAgIH0uYmluZCh0aGlzKSlcbiAgKTtcbn07XG5cbkJvYXJkLmZpbmREZWFkU3RvbmVzID0gZnVuY3Rpb24oYm9hcmQsIHNlZWRfc3RvbmVzKSB7XG4gIHZhciBkZWFkX2dyb3VwcyA9IHNlZWRfc3RvbmVzLm1hcChmdW5jdGlvbihzZWVkX3N0b25lKSB7XG4gICAgdmFyIGdyb3VwID0gW3NlZWRfc3RvbmVdO1xuICAgIHZhciBpID0gMDtcblxuICAgIHdoaWxlIChncm91cC5sZW5ndGggPiBpICYmIChib2FyZC5ib2FyZF9zaXplICogYm9hcmQuYm9hcmRfc2l6ZSkgPiBncm91cC5sZW5ndGgpIHtcbiAgICAgIHZhciB0aGlzX3N0b25lID0gZ3JvdXBbaV07XG4gICAgICBpZiAoYm9hcmQubGliZXJ0eSh0aGlzX3N0b25lLngsIHRoaXNfc3RvbmUueSkpIHsgcmV0dXJuIFtdIH1cbiAgICAgIFxuICAgICAgdmFyIGZyaWVuZGx5X25laWdoYm9ycyA9IGJvYXJkLm5laWdoYm9ycyh0aGlzX3N0b25lLngsIHRoaXNfc3RvbmUueSkuZmlsdGVyKGZ1bmN0aW9uKG5laWdoYm9yX3N0b25lKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpc19zdG9uZS5jb2xvciA9PT0gbmVpZ2hib3Jfc3RvbmUuY29sb3IgJiZcbiAgICAgICAgICAhXy5jb250YWlucyhncm91cCwgbmVpZ2hib3Jfc3RvbmUpXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIGdyb3VwID0gZ3JvdXAuY29uY2F0KGZyaWVuZGx5X25laWdoYm9ycyk7ICAgICAgXG4gICAgICBpID0gaSArIDE7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBncm91cDtcbiAgfSlcbiAgcmV0dXJuIF8uY29tcGFjdChfLmZsYXR0ZW4oZGVhZF9ncm91cHMpKTtcbn1cblxuQm9hcmQucmVtb3ZlQ2FwdHVyZXMgPSBmdW5jdGlvbihib2FyZCwgbmV3X3N0b25lKSB7XG4gIGlmIChib2FyZCA9PT0gbnVsbCB8fCBuZXdfc3RvbmUgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gIC8vIGZpbmQgbmVpZ2hib3Jpbmcgc3RvbmVzIHRoYXQgaGFkIGxpYmVydHkgcmVkdWNlZCAuLi5cbiAgdmFyIGVuZW15X25laWdoYm9ycyA9IGJvYXJkLm5laWdoYm9ycyhuZXdfc3RvbmUueCwgbmV3X3N0b25lLnkpLmZpbHRlcihmdW5jdGlvbihuZWlnaGJvcl9zdG9uZSkge1xuICAgIHJldHVybiAobmV3X3N0b25lLmNvbG9yICE9PSBuZWlnaGJvcl9zdG9uZS5jb2xvcik7XG4gIH0pOyAgXG4gIGlmIChlbmVteV9uZWlnaGJvcnMubGVuZ3RoID09PSAwKSB7IHJldHVybiBib2FyZCB9XG4gIFxuICB2YXIgZGVhZF9zdG9uZXMgPSBCb2FyZC5maW5kRGVhZFN0b25lcyhib2FyZCwgZW5lbXlfbmVpZ2hib3JzKTtcbiAgaWYgKGRlYWRfc3RvbmVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gYm9hcmQgfVxuICAgIFxuICB2YXIgZGVhZF9zdG9uZV9vdmVybGF5ID0gZGVhZF9zdG9uZXMucmVkdWNlKGZ1bmN0aW9uKG92ZXJsYXksIGRlYWRfc3RvbmUpIHtcbiAgICAgb3ZlcmxheVtib2FyZC5fY29vcmRpbmF0ZXNUb0luZGV4KGRlYWRfc3RvbmUueCwgZGVhZF9zdG9uZS55KV0gPSB0cnVlO1xuICAgICByZXR1cm4gb3ZlcmxheTtcbiAgfSwge30pO1xuICAgIFxuICByZXR1cm4gbmV3IEJvYXJkKFxuICAgIGJvYXJkLmJvYXJkX3NpemUsXG4gICAgYm9hcmQuZ3JpZC5tYXAoZnVuY3Rpb24oc3RvbmUsIGkpIHtcbiAgICAgIHJldHVybiAoZGVhZF9zdG9uZV9vdmVybGF5W2ldKSA/IG51bGwgOiBzdG9uZTtcbiAgICB9KVxuICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQ2hyaXMgUGFwYXppYW5cbiAqIFxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG4gXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIFN0b25lID0gZnVuY3Rpb24oeCwgeSwgY29sb3IpIHtcbiAgdGhpcy54ID0geDtcbiAgdGhpcy55ID0geTtcbiAgdGhpcy5jb2xvciA9IGNvbG9yO1xufTtcblxuU3RvbmUuQkxBQ0sgPSAwO1xuU3RvbmUuV0hJVEUgPSAxO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b25lO1xuIl19
