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

var Model = function(attributes) {
  this.attributes = (attributes !== undefined) ? attributes : {};;
  this.initialize.apply(this, arguments);
};

Model.prototype.initialize = function() {};

Model.extend = function(definition) {
  var parent = this;
  var child;
  
  var child = function() {
    return parent.apply(this, arguments); 
  };
  
  _.extend(child, parent);
  
  child.prototype = Object.create(parent.prototype);
  
  Object.defineProperties(child.prototype, _.defaults(
    _.object(
      _.map(_.pairs(definition.methods), function(pair) {
        return [pair[0], { value: pair[1], configurable: true }]
      })
    ),
    _.object(
      definition.attributes,
      _.map(definition.attributes, function(attribute) {
        return {
          get: function() { return this.attributes[attribute] },
          set: function(value) { this.attributes[attribute] = value },
          configurable: true
        }
      })
    )
  ));

  return child;
};

module.exports = Model;
