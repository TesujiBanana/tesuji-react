/**
 * Copyright 2014 Chris Papazian
 *
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var TesujiApp = require('tesuji_app');
var Router = require('director').Router;

var Game = require('game');

var routes = {
  '/game': function() {
    console.log('errp!');
    React.renderComponent(TesujiApp({game: new Game()}), document.getElementById('tesuji_app'));
  },
  '/game/.*': function() {
    var game_data;
    try {
      game_data = JSON.parse(atob(window.location.hash.slice(7)));
    }
    catch(err) {
      console.log('inavlid game data' + err);
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
