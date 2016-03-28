var View = require('./views.js');
var Model = require('./models.js');
var $ = require("jquery");
var d3 = require('d3');
require('../css/style.css');
require('../css/xynoci.css');
require('../css/barchart_style.css');
window.$ = window.jQuery = $;

var data = "../data/state.json";
var conditions = new Model.Conditions();
var bar = new View.barChartView({
    model: conditions
});
bar.listenTo(conditions, "change", bar.render);
conditions.set("data", data);
