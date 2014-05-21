/**
 * Copyright 2014 Chris Papazian
 * 
 */
 

// var Dispatcher = (function() {
//   var _callbacks = {};
//   
//   return {
//     register: function(event_name, callback) {
//       if (typeof _callbacks[event_name] === 'undefined') {
//         _callbacks[event_name] = [];
//       }
//       return _callbacks[event_name].push(callback);
//     },
//     trigger: function(event_name, payload) {
//       if (typeof _callbacks[event_name] !== 'undefined') {
//         _.each(_callbacks[event_name], function(callback) { 
//           callback(payload)
//         });
//       }
//     }
//   };
// }());
// 
