/**
 * Copyright 2014 Chris Papazian
 *
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var TesujiApp = require('tesuji_app');
var Router = require('director').Router;
var lz = require('lz-string');

var Game = require('game');

var routes = {
  '/game': function() {
    React.renderComponent(TesujiApp({game: new Game()}), document.getElementById('tesuji_app'));
  },
  '/game/.*': function() {
    var game_data;
    try {
      game_data = JSON.parse(lz.decompressFromBase64(window.location.hash.slice(7)));
    }
    catch(err) {
      try {
        game_data = JSON.parse(atob(window.location.hash.slice(7)));
      }
      catch(err2) {
        console.log('inavlid game data: ' + err);
      }
    }

    var game = game_data ? new Game(game_data) : new Game();

    React.renderComponent(TesujiApp({game: game}), document.getElementById('tesuji_app'));
  },
  '/errp': function() {
    console.log('derrp');
  }
};

var router = new Router(routes);
router.init();
