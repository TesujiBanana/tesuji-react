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

var Model = function() {};

Model.isModel = function(model) {
  // Duck type this ... as long as it quacks a serialize method, we're ducky.
  return typeof model === 'object' && typeof model.serialize === 'function';
};

Model.prototype.initialize = function(attributes) { return attributes; };

Model.prototype.serialize = function() {
  var _serializeAttribute = function _serializeAttribute(attr) { 
    return (
      Array.isArray(attr) ? _serializeArray(attr) :
      Model.isModel(attr) ? attr.serialize() :
      JSON.stringify(attr)
    );
  };
  
  var _serializeArray = function _serializeArray(arr) {
    return '[' + arr.map(function(attr) { 
      return _serializeAttribute(attr) 
    }).join(',') + ']';
  };
  
  var obj = this;
  return '{' + this.attributes.map(function(attr) {
    return '"' + attr + '"' + ':' + _serializeAttribute(obj[attr]);
  }).join(',') + '}';
};

Model.extend = function(definition) {
  var parent = this;

  var child = function(attributes) {
    _.extend(
      this,
      this.initialize(
        _.defaults(
          (attributes !== undefined) ? attributes : {},
          definition.defaults
        )
      )
    );
  };

  _.extend(child, parent, definition.constants);

  child.prototype = _.extend(
    Object.create(parent.prototype),
    definition.methods,
    { attributes: definition.attributes }
  );

  return child;
};

module.exports = Model;
