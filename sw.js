var __wpo = {"assets":{"main":["./app.js","./../dist/index.d.ts","./../dist/src/App.d.ts","./../dist/src/Card.d.ts","./../dist/src/Clock.d.ts","./../dist/src/Game.d.ts","./../dist/src/Lobby.d.ts","./../dist/src/Menu.d.ts","./../dist/src/Shape.d.ts","./../dist/src/messages.d.ts","./","./manifest.783ae060b91a6914319362b6e98c090d.json","./icon_1024x1024.71ac4c77cca511bf02b4c697c1a46c7d.png","./icon_512x512.a7b9d0d1c1eb511c3b9c791e70541ba0.png","./icon_384x384.554babccf175c11aea81580a827da95b.png","./icon_256x256.9d933aaba1beaa2310ee6044f75d38c4.png","./icon_192x192.21194ce037eae55e203e9c3be5eb89f1.png","./icon_128x128.8e9937d130dba02bc02852b65541252f.png","./icon_96x96.c1a8dee039169b0344dffcef82fa9d33.png"],"additional":[],"optional":[]},"externals":[],"hashesMap":{"9437c74e1cedd47332cc47d6b5328d5da3a25aa0":"./app.js","b878c11a77128e74c3cf15c93ef2ceddf2aa0b38":"./../dist/index.d.ts","bae374b2ede69590aba23ea309d28a5e35fb494b":"./../dist/src/App.d.ts","e1937b0b16c314ece28980c123ae0a6852f76f62":"./../dist/src/Card.d.ts","a898042b858071ae8d88d35668fa71f2b9344465":"./../dist/src/Clock.d.ts","db4e0daad7ae3413417fd827a639c8a34a52573e":"./../dist/src/Game.d.ts","1853babe0a047b6814a7790f483ad5627175d61a":"./../dist/src/Lobby.d.ts","425cae7fcf620e07e623f3028a20234b81e341c2":"./../dist/src/Menu.d.ts","37f6d94a0507bc224e789a9c8679eb00eac2c5fe":"./../dist/src/Shape.d.ts","f8883f4ebd9ad29cde5caf741eed854c2ca24ce0":"./../dist/src/messages.d.ts","8d3037bf7d89c6acdcce5ce66f8fae0f22adafe6":"./","132b0a8b7085ed457238890e0898989e6c9a3ec3":"./manifest.783ae060b91a6914319362b6e98c090d.json","2d07dd6141e815336fed3f099872846857354b13":"./icon_1024x1024.71ac4c77cca511bf02b4c697c1a46c7d.png","a60d85bb3dac8ad766377a3394f1c48f9ee584fa":"./icon_512x512.a7b9d0d1c1eb511c3b9c791e70541ba0.png","8b2df967574e3a29ad6d83a5de11da68b8c546df":"./icon_384x384.554babccf175c11aea81580a827da95b.png","d0ae25d34b9c524bf2eee5bbdc7005950509db0c":"./icon_256x256.9d933aaba1beaa2310ee6044f75d38c4.png","3dd7a76f7d75d23edad4ed11e76f1781d53dce8c":"./icon_192x192.21194ce037eae55e203e9c3be5eb89f1.png","8dbf0290f98abe1d7a5df5e7328c4a98541cf7d8":"./icon_128x128.8e9937d130dba02bc02852b65541252f.png","535e5f383c2fabac66ef2c856f1b695f768871b0":"./icon_96x96.c1a8dee039169b0344dffcef82fa9d33.png"},"strategy":"changed","responseStrategy":"cache-first","version":"2018-11-28 11:23:25","name":"webpack-offline","pluginVersion":"5.0.6","relativePaths":true};

!function(e){var n={};function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(r,i,function(n){return e[n]}.bind(null,i));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";var r,i,o;if(r=ExtendableEvent.prototype.waitUntil,i=FetchEvent.prototype.respondWith,o=new WeakMap,ExtendableEvent.prototype.waitUntil=function(e){var n=this,t=o.get(n);if(!t)return t=[Promise.resolve(e)],o.set(n,t),r.call(n,Promise.resolve().then(function e(){var r=t.length;return Promise.all(t.map(function(e){return e.catch(function(){})})).then(function(){return t.length!=r?e():(o.delete(n),Promise.all(t))})}));t.push(Promise.resolve(e))},FetchEvent.prototype.respondWith=function(e){return this.waitUntil(e),i.call(this,e)},void 0===a)var a=!1;function u(e,n){return caches.match(e,{cacheName:n}).then(function(t){return c(t)?t:s(t).then(function(t){return caches.open(n).then(function(n){return n.put(e,t)}).then(function(){return t})})}).catch(function(){})}function c(e){return!e||!e.redirected||!e.ok||"opaqueredirect"===e.type}function s(e){return c(e)?Promise.resolve(e):("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status})})}function f(e,n){n.forEach(function(e){})}!function(e,n){var t=n.cacheMaps,r=n.navigationPreload,i=e.strategy,o=e.responseStrategy,a=e.assets,c=e.hashesMap,l=e.externals,h=e.prefetchRequest||{credentials:"same-origin",mode:"cors"},d=e.name,p=e.version,v=d+":"+p,m=d+"$preload",g="__offline_webpack__data";Object.keys(a).forEach(function(e){a[e]=a[e].map(function(e){var n=new URL(e,location);return n.hash="",-1===l.indexOf(e)&&(n.search=""),n.toString()})}),c=Object.keys(c).reduce(function(e,n){var t=new URL(c[n],location);return t.search="",t.hash="",e[n]=t.toString(),e},{}),l=l.map(function(e){var n=new URL(e,location);return n.hash="",n.toString()});var y=[].concat(a.main,a.additional,a.optional);function w(n){var t=a[n];return caches.open(v).then(function(r){return q(r,t,{bust:e.version,request:h,failAll:"main"===n})}).then(function(){f(0,t)}).catch(function(e){throw e})}function P(n){return caches.keys().then(function(e){for(var n=e.length,t=void 0;n--&&0!==(t=e[n]).indexOf(d););if(t){var r=void 0;return caches.open(t).then(function(e){return r=e,e.match(new URL(g,location).toString())}).then(function(e){if(e)return Promise.all([r,r.keys(),e.json()])})}}).then(function(t){if(!t)return w(n);var r=t[0],i=t[1],o=t[2],u=o.hashmap,s=o.version;if(!o.hashmap||s===e.version)return w(n);var l=Object.keys(u).map(function(e){return u[e]}),d=i.map(function(e){var n=new URL(e.url);return n.search="",n.hash="",n.toString()}),p=a[n],m=[],g=p.filter(function(e){return-1===d.indexOf(e)||-1===l.indexOf(e)});Object.keys(c).forEach(function(e){var n=c[e];if(-1!==p.indexOf(n)&&-1===g.indexOf(n)&&-1===m.indexOf(n)){var t=u[e];t&&-1!==d.indexOf(t)?m.push([t,n]):g.push(n)}}),f(0,g),f(0,m);var y=Promise.all(m.map(function(e){return r.match(e[0]).then(function(n){return[e[1],n]})}));return caches.open(v).then(function(t){var r=y.then(function(e){return Promise.all(e.map(function(e){return t.put(e[0],e[1])}))});return Promise.all([r,q(t,g,{bust:e.version,request:h,failAll:"main"===n,deleteFirst:"main"!==n})])})})}function b(){return caches.keys().then(function(e){var n=e.map(function(e){if(0===e.indexOf(d)&&0!==e.indexOf(v))return caches.delete(e)});return Promise.all(n)})}function O(){return caches.open(v).then(function(n){var t=new Response(JSON.stringify({version:e.version,hashmap:c}));return n.put(new URL(g,location).toString(),t)})}self.addEventListener("install",function(e){var n=void 0;n="changed"===i?P("main"):w("main"),e.waitUntil(n)}),self.addEventListener("activate",function(e){var n=function(){if(!a.additional.length)return Promise.resolve();return("changed"===i?P("additional"):w("additional")).catch(function(e){})}();n=(n=(n=n.then(O)).then(b)).then(function(){if(self.clients&&self.clients.claim)return self.clients.claim()}),r&&self.registration.navigationPreload&&(n=Promise.all([n,self.registration.navigationPreload.enable()])),e.waitUntil(n)}),self.addEventListener("fetch",function(e){if("GET"===e.request.method&&("only-if-cached"!==e.request.cache||"same-origin"===e.request.mode)){var n=new URL(e.request.url);n.hash="";var i=n.toString();-1===l.indexOf(i)&&(n.search="",i=n.toString());var a=-1!==y.indexOf(i),c=i;if(!a){var s=function(e){var n=e.url,r=new URL(n),i=void 0;i=function(e){return"navigate"===e.mode||e.headers.get("Upgrade-Insecure-Requests")||-1!==(e.headers.get("Accept")||"").indexOf("text/html")}(e)?"navigate":r.origin===location.origin?"same-origin":"cross-origin";for(var o=0;o<t.length;o++){var a=t[o];if(a&&(!a.requestTypes||-1!==a.requestTypes.indexOf(i))){var u=void 0;if((u="function"==typeof a.match?a.match(r,e):n.replace(a.match,a.to))&&u!==n)return u}}}(e.request);s&&(c=s,a=!0)}if(a){var f=void 0;f="network-first"===o?function(e,n,t){return U(e).then(function(e){if(e.ok)return e;throw e}).catch(function(e){return u(t,v).then(function(n){if(n)return n;if(e instanceof Response)return e;throw e})})}(e,0,c):function(e,n,t){return function(e){if(r&&"function"==typeof r.map&&e.preloadResponse&&"navigate"===e.request.mode){var n=r.map(new URL(e.request.url),e.request);n&&function(e,n){var t=new URL(e,location),r=n.preloadResponse;x.set(r,{url:t,response:r});var i=function(){return x.has(r)},o=r.then(function(e){if(e&&i()){var n=e.clone();return caches.open(m).then(function(e){if(i())return e.put(t,n).then(function(){if(!i())return caches.open(m).then(function(e){return e.delete(t)})})})}});n.waitUntil(o)}(n,e)}}(e),u(t,v).then(function(r){return r||fetch(e.request).then(function(r){return r.ok?(t===n&&(i=r.clone(),o=caches.open(v).then(function(e){return e.put(n,i)}).then(function(){}),e.waitUntil(o)),r):r;var i,o})})}(e,i,c),e.respondWith(f)}else{if("navigate"===e.request.mode&&!0===r)return void e.respondWith(U(e));if(r){var h=function(e){var n=new URL(e.request.url);if(self.registration.navigationPreload&&r&&r.test&&r.test(n,e.request)){var t=function(e){if(x){var n=void 0,t=void 0;return x.forEach(function(r,i){r.url.href===e.href&&(n=r.response,t=i)}),n?(x.delete(t),n):void 0}}(n),i=e.request;return t?(e.waitUntil(caches.open(m).then(function(e){return e.delete(i)})),t):u(i,m).then(function(n){return n&&e.waitUntil(caches.open(m).then(function(e){return e.delete(i)})),n||fetch(e.request)})}}(e);if(h)return void e.respondWith(h)}}}}),self.addEventListener("message",function(e){var n=e.data;if(n)switch(n.action){case"skipWaiting":self.skipWaiting&&self.skipWaiting()}});var x=new Map;function q(e,n,t){var r=t.bust,i=!1!==t.failAll,o=!0===t.deleteFirst,a=t.request||{credentials:"omit",mode:"cors"},u=Promise.resolve();return o&&(u=Promise.all(n.map(function(n){return e.delete(n).catch(function(){})}))),Promise.all(n.map(function(e){var n,t,i;return r&&(t=r,i=-1!==(n=e).indexOf("?"),e=n+(i?"&":"?")+"__uncache="+encodeURIComponent(t)),fetch(e,a).then(s).then(function(e){return e.ok?{response:e}:{error:!0}},function(){return{error:!0}})})).then(function(t){return i&&t.some(function(e){return e.error})?Promise.reject(new Error("Wrong response status")):(i||(t=t.filter(function(e){return!e.error})),u.then(function(){var r=t.map(function(t,r){var i=t.response;return e.put(n[r],i)});return Promise.all(r)}))})}function U(e){return e.preloadResponse&&!0===r?e.preloadResponse.then(function(n){return n||fetch(e.request)}):fetch(e.request)}}(__wpo,{loaders:{},cacheMaps:[],navigationPreload:!1}),e.exports=t(1)},function(e,n){}]);