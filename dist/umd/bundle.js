(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "name": "sets-game",
  "version": "0.0.1",
  "scripts": {
    "compile": "tsc",
    "build:dev": "simplifyify src/index.tsx -o dist/umd/bundle.js --debug --bundle",
    "build:prod": "simplifyify src/index.tsx -o dist/umd/bundle.min.js --minify",
    "build": "simplifyify src/index.tsx -o dist/umd/bundle.js --debug --bundle --minify"
  },
  "dependencies": {
    "@material-ui/core": "^3.4.0",
    "p2p-lobby": "0.0.14",
    "react": "^16.6.1",
    "react-dom": "^16.6.1",
    "sets-game-engine": "git://github.com/mothepro/sets-game-engine.git"
  },
  "devDependencies": {
    "@types/node": "^10.11.3",
    "@types/react": "^16.4.18",
    "@types/react-dom": "^16.0.9",
    "browserify": "^16.2.3",
    "browserify-shim": "^3.8.14",
    "ipfs": "^0.32.3",
    "mocha": "^5.2.0",
    "should": "^13.2.3",
    "simplifyify": "^7.0.0",
    "strict-event-emitter-types": "^2.0.0",
    "typescript": "^3.1.1"
  },
  "browserify": {
    "transform": [
      "browserify-shim"
    ]
  },
  "browserify-shim": {
    "p2p-lobby": "global:p2p",
    "react": "global:React",
    "react-dom": "global:ReactDOM",
    "@material-ui/core": "global:material-ui"
  }
}

},{}],2:[function(require,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("../package.json");
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var react_dom_1 = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);
var core_1 = (typeof window !== "undefined" ? window['material-ui'] : typeof global !== "undefined" ? global['material-ui'] : null);
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        /** Switches Material UI Theme and body's background color */
        _this.toggleTheme = function () {
            document.body.style.backgroundColor = (!_this.state.light ? App.lightTheme : App.darkTheme).palette.background.default;
            _this.setState({ light: !_this.state.light });
        };
        _this.state = {
            light: true,
        };
        return _this;
    }
    App.prototype.render = function () {
        return React.createElement(React.Fragment, null,
            React.createElement(core_1.CssBaseline, null),
            React.createElement(core_1.MuiThemeProvider, { theme: this.state.light ? App.lightTheme : App.darkTheme },
                React.createElement(core_1.IconButton, { onClick: this.toggleTheme, style: {
                        position: 'absolute',
                        right: App.lightTheme.spacing.unit,
                        top: App.lightTheme.spacing.unit,
                    } },
                    React.createElement(core_1.Icon, { fontSize: "small" }, "wb_incandescent"))));
    };
    App.darkTheme = core_1.createMuiTheme({
        palette: { type: 'dark' },
        typography: { useNextVariants: true },
    });
    App.lightTheme = core_1.createMuiTheme({
        palette: { type: 'light' },
        typography: { useNextVariants: true },
    });
    return App;
}(React.Component));
react_dom_1.render(React.createElement(App, { package: package_json_1.name + "@" + package_json_1.version }), document.getElementById('app'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../package.json":1}]},{},[2])
//# sourceMappingURL=bundle.js.map
