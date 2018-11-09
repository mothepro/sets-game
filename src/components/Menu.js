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
var sets_game_engine_1 = require("sets-game-engine");
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(props) {
        var _this = _super.call(this, props) || this;
        _this.startSolo = function () {
            _this.props.onReady([new sets_game_engine_1.Player]);
        };
        _this.state = {
            name: '',
        };
        return _this;
    }
    Menu.prototype.render = function () {
        var _this = this;
        return React.createElement(React.Fragment, null,
            React.createElement(core_1.Typography, { variant: "h2", gutterBottom: true }, "Sets"),
            React.createElement("br", null),
            React.createElement(core_1.Button, { variant: "contained", color: "primary", size: "large", onClick: this.startSolo }, "Play Solo"),
            React.createElement("br", null),
            React.createElement(core_1.TextField, { label: "Name", value: this.state.name, onChange: function (event) { return _this.setState({ name: event.target.value }); }, margin: "normal", variant: "outlined" }),
            React.createElement(core_1.Button, { variant: "contained", color: "primary", disabled: this.state.name.trim().length < 2 }, "Play with People"));
    };
    return Menu;
}(React.Component));
exports.default = Menu;
//# sourceMappingURL=Menu.js.map