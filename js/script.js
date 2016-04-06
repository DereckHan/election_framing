/*************** temporary ***************/
// view_t -> View
// model_t -> Model
var view_t = require('./views.js');
var model_t = require('./models.js');
var View = require('./views_yuesongli.js');
/*************** temporary ***************/

var $ = require("jquery");
window.$ = window.jQuery = $;
var d3 = require('d3');
require('../css/style.css');
require('../css/xynoci.css');
require('../css/barchart_style.css');


$(document).ready(function() {
    //var data = "../data/state.json";
    // var conditions = new Model.Conditions();
    // var bar = new View.BarSetView({
    //     model: conditions
    // });
    // bar.listenTo(conditions, "change", bar.clear);
    // bar.listenTo(conditions, "change", bar.render);
    //conditions.set("data", data);


    var state = new model_t.State();
    var state_data = state.fetch({
        success: function(model, response, options) {
            attributes = model.attributes;
            console.log(attributes["time"]);
            console.log(attributes["Alabama"]);
            console.log(attributes["Alabama"]["eco"]);
            console.log(attributes["Alabama"]["eco"]["day"]);
            console.log(attributes["Alabama"]["eco"]["day"]["begin_time"]);
            var terms = attributes["Alabama"]["eco"]["day"]["term_set"];
            console.log(terms);
            var key_set = Object.keys(terms);
            console.log(key_set);
        }
    });
});