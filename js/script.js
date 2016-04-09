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

var states_base = ["Alabama", "Alaska", "Arizona", "Arkansas", "California",
        "Colorado", "Connecticut", "Delaware", "District of Columbia",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "lowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
        "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ],
    candidates_base = ["Hillary Clinton", "Bernie Sanders", "Ted Cruz",
        "John Kasich", "Donald J. Trump", "Lincoln Chafee", "Lawrence Lessig",
        "Martin O’Malley", "Jim Webb", "Jeb Bush", "Ben Carson",
        "Chris Christie", "Carly Fiorina", "Jim Gilmore", "Lindsey Graham",
        "Mike Huckabee", "Bobby Jindal", "George Pataki", "Rand Paul",
        "Rick Perry", "Marco Rubio", "Rick Santorum", "Scott Walker",
        "Joseph R. Biden Jr.", "Elizabeth Warren", "Mitt Romney"
    ],
    parties_base = ["Democratic", "Republican"];

$(document).ready(function() {
    /*************** test functions ***************/
    $("#show").click(
        function() {
            alert("topic: " + conditions.get("topic") + "\ncategory: " + conditions.get("category") + " \noption-1 :" + conditions.get("option_1") + " \noption_2 :" + conditions.get("option_2"));
        }
    );

    /*************** main content ***************/
    var state = new model_t.State(),
        party = new model_t.Party(),
        candidate = new model_t.Candidate(),
        conditions = new model_t.Conditions();

    var bar = new View.BarSetView({
        model: conditions
    });
    bar.listenTo(conditions, "change", bar.clear);
    bar.listenTo(conditions, "change", bar.render);


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

    /*************** single element change ***************/
    $("div#category select").change(function() {
        category = $(this).val();
        $("div#option-1 select").html("");
        $("div#option-2 select").html("");
        $("div#option-1 select").selectpicker('refresh');
        $("div#option-2 select").selectpicker('refresh');
        switch (category) {
            case "States":
                conditions.set("category", "state");
                addOption(states_base);
                break;
            case "Parties":
                conditions.set("category", "party");
                addOption(parties_base);

                break;
            case "Candidates":
                conditions.set("category", "candidate");
                addOption(candidates_base);
                break;
        };
    });
    $("div#option-1 select").change(function() {
        var option1 = $(this).val();
        $("div#option-2 option").prop('disabled', false);
        $("div#option-2 option[value='" + option1 + "']").prop('disabled', true);
        $("div#option-2 select").selectpicker('refresh');
        conditions.set("option_1", $(this).val());
    });
    $("div#option-2 select").change(function() {
        var option2 = $(this).val();
        $("div#option-1 option").prop('disabled', false);
        $("div#option-1 option[value='" + option2 + "']").prop('disabled', true);
        $("div#option-1 select").selectpicker('refresh');
        conditions.set("option_2", $(this).val());
    });
    $("div#topic label").click(function() {
        conditions.set("topic", $(this).attr("id"));
    });

    /*************** load DOMs ***************/
    addOption(states_base);

    function addOption(data) {
        for (var i = 0; i < data.length; i++) {
            $("div#option-1 select").append("<option value='" + data[i] + "'>" + data[i] + "</option>");
            $("div#option-2 select").append("<option value='" + data[i] + "'>" + data[i] + "</option>");
        };
        $("div#option-1 select").val(data[0]);
        $("div#option-2 option[value='" + data[0] + "']").prop('disabled', true);
        $("div#option-2 select").val(data[1]);
        $("div#option-1 option[value='" + data[1] + "']").prop('disabled', true);
        conditions.set("option_1", data[0]);
        conditions.set("option_2", data[1]);
        $("div#option-1 select").selectpicker('refresh');
        $("div#option-2 select").selectpicker('refresh');
        $('#option-1 button').attr("class", "btn dropdown-toggle btn-primary");
        $('#option-2 button').attr("class", "btn dropdown-toggle btn-info");
    }

});
