"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("../package.json");
var React = require("react");
var react_dom_1 = require("react-dom");
var App_1 = require("./components/App");
react_dom_1.render(React.createElement(App_1.default, { package: package_json_1.name + "@" + package_json_1.version }), document.getElementById('app'));
if (module.hot)
    module.hot.accept();
//# sourceMappingURL=index.js.map