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
var React = require("react");
var core_1 = require("@material-ui/core");
var Menu_1 = require("./Menu");
var Game_1 = require("./Game");
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
        var _this = this;
        return React.createElement(React.Fragment, null,
            React.createElement(core_1.CssBaseline, null),
            React.createElement(core_1.MuiThemeProvider, { theme: this.state.light ? App.lightTheme : App.darkTheme },
                React.createElement(core_1.IconButton, { onClick: this.toggleTheme, style: {
                        position: 'absolute',
                        right: App.lightTheme.spacing.unit,
                        top: App.lightTheme.spacing.unit,
                    } },
                    React.createElement(core_1.Icon, { fontSize: "small" }, "wb_incandescent")),
                this.state.players
                    ? React.createElement(Game_1.default, { players: this.state.players })
                    : React.createElement(Menu_1.default, { package: this.props.package, onReady: function (players) { return _this.setState({ players: players }); } })));
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
exports.default = App;
//# sourceMappingURL=App.js.map