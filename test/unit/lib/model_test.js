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

/*jshint -W030 */
/*global describe */
/*global it */

var expect = require('chai').expect;

// var _ = require('underscore');

var Model = require('../../../src/lib/model.js');

describe('Model', function() {
  describe('getters and setters', function() {
    var Foo = Model.extend({attributes: ['bar', 'baz']});

    it('can accessed props set on create', function() {
      var foo = new Foo({bar: 'asdf'});
      expect(foo.bar).to.equal('asdf');
    });

    it('can set and get props', function() {
      var foo = new Foo({bar: 'asdf'});
      foo.bar = 'fdas';
      expect(foo.bar).to.equal('fdas');
    });
  });

  describe('initialize', function() {
    it('is called by the constructor', function() {
      var Foo = Model.extend({
        attributes: ['bar'],
        methods: {
          initialize: function() {
            return {
              bar: 'baz'
            };
          }
        }
      });

      var foo = new Foo({bar: 'foo'});
      expect(foo.bar).to.equal('baz');
    });

    it('has access to the attributes hash', function() {
      var Foo = Model.extend({
        attributes: ['bar'],
        methods: {
          initialize: function(attributes) {
            attrs = attributes;
          }
        }
      });

      var attrs;
      new Foo({bar: 'baz'});
      expect(attrs).to.eql({bar: 'baz'});
    });
  });

  describe('defaults', function() {
    var Foo = Model.extend({
      attributes: ['foo', 'bar', 'baz'],
      defaults: {
        foo: 1,
        bar: 2,
        baz: 3
      },
      methods: {
        initialize: function(attributes) {
          if (attributes.bar === 10) {
            attributes.bar = -1;
          }
          return attributes;
        }
      }
    });

    it('sets default attributes', function() {
      var foo = new Foo();
      expect(foo.foo).to.eql(1);
      expect(foo.bar).to.eql(2);
      expect(foo.baz).to.eql(3);
    });

    it('is overridden by setting in the constructor', function() {
      var foo = new Foo({foo: 10});
      expect(foo.foo).to.eql(10);
    });

    it('is overridden by setting in initialize', function() {
      var foo = new Foo({bar: 10});
      expect(foo.bar).to.eql(-1);
    });
  });
  
  describe('constants', function() {
    it('should register constant values', function() {
      var Foo = Model.extend({
        constants: {
          BAR: 'bar'
        }
      });
      expect(Foo.BAR).to.equal('bar');
    });
  });
  
  describe('serialize', function() {
    it('returns some JSON', function() {
      var Foo = Model.extend({ attributes: ['bar', 'baz']});
      var foo = new Foo({bar: 'foobar', baz: 1});
      expect(foo.serialize()).to.equal('{"bar":"foobar","baz":1}');
    });
    
    it('renders plain-old-javascript-object attributes', function() {
      var Foo = Model.extend({ attributes: ['bar', 'baz']});
      var foo = new Foo({bar: 'foobar', baz: {foo: 'bar'}});
      expect(foo.serialize()).to.equal('{"bar":"foobar","baz":{"foo":"bar"}}');
    });
    
    it('nests model objects', function() {
      var Foo = Model.extend({ attributes: ['bar', 'baz']});
      var Bar = Model.extend({ 
        attributes: ['foo'], 
        methods: { serialize: function() { return JSON.stringify(this.foo); }}
      });
      var foo = new Foo({bar: new Bar({foo: 'bar'}), baz: 1});
      expect(foo.serialize()).to.equal('{"bar":"bar","baz":1}');
    });
    
    it('nests arrays', function() {
      var Foo = Model.extend({ attributes: ['bar']});
      var foo = new Foo({bar: [1, 2, {foo: 'bar'}]});
      expect(foo.serialize()).to.equal('{"bar":[1,2,{"foo":"bar"}]}');
    });
    
    it('maintains attribute order', function() {
      var Foo = Model.extend({ attributes: ['bar', 'baz']});
      var foo1 = new Foo({bar: 'foobar', baz: 1});
      var foo2 = new Foo({baz: 1, bar: 'foobar'});
      expect(foo1.serialize()).to.equal(foo2.serialize());
    });
  });

  describe('methods', function() {
    var Foo = Model.extend({
      attributes: ['bar', 'baz'],
      methods: {
        f: function(x) { return x * x; },
        g: function(x) { return x + this.bar; }
      }
    });

    it('can use a method', function() {
      var foo = new Foo();
      expect(foo.f(4)).to.equal(16);
    });

    it('can use a method that depends on this', function() {
      var foo = new Foo({bar: 2});
      expect(foo.g(4)).to.equal(6);
    });
  });

  describe('extend', function() {
    it('can be extended', function() {
      var Foo = Model.extend({attributes: ['bar']});
      var Bar = Foo.extend({attributes: ['baz']});
      var bar = new Bar({bar: 'bar', baz: 'baz'});
      expect(bar.bar).to.equal('bar');
      expect(bar.baz).to.equal('baz');
    });
  });
});
