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
var sets_game_engine_1 = require("sets-game-engine");
var core_1 = require("@material-ui/core");
var Card_1 = require("./Card");
var GameUI = /** @class */ (function (_super) {
    __extends(GameUI, _super);
    function GameUI(props) {
        var _this = _super.call(this, props) || this;
        _this.render = function () { return React.createElement(core_1.Grid, { container: true },
            "Players ",
            React.createElement("code", null, _this.game.players.length),
            _this.game.playableCards.map(function (card, i) { return React.createElement(Card_1.default, { key: i, card: card }); })); };
        _this.game = new sets_game_engine_1.Game({
            players: props.players
        });
        _this.game.start();
        return _this;
    }
    return GameUI;
}(React.Component));
exports.default = GameUI;
//# sourceMappingURL=Game.js.map