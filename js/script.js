var View = require('./views.js');
var Model = require('./models.js');
var $ = require("jquery");
window.$ = window.jQuery = $;
var d3 = require('d3');
require('../css/style.css');


var query = new Model.Query();
var bar = new View.barChartView({
    model: query
});
var data = "../data/sample_day.json";
query.set("data", data);
