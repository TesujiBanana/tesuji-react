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

var Model = require('../../../src/lib/model.js');

describe('Model', function() {
  describe('getters and setters', function() {
    var Foo = Model.extend({attributes: ['bar', 'baz']});
    
    it('can accessed props set on create', function() {
      var foo = new Foo({bar: 'asdf'});
      expect(foo.bar).to.equal('asdf');
    });
    
    it('get sets props correctly', function() {
      var foo = new Foo({bar: 'asdf'});
      foo.bar = 'fdas';
      expect(foo.attributes.bar).to.equal('fdas');
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
            this.bar = 'baz';
          }
        }
      });
      
      var foo = new Foo();
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
