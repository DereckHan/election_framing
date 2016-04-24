/*************** temporary ***************/
// view_t -> View
// model_t -> Model
var view_t = require('./views.js');
var model_t = require('./models.js');
var View = require('./views_yuesongli.js');

/*************** Js ***************/
require('../css/style.css');
require('../css/xynoci.css');
require('../css/barchart_style.css');
var $ = require("jquery");
window.$ = window.jQuery = $;
var d3 = require('d3');
var _ = require('underscore');

/*************** resources ***************/
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

var state = new model_t.State();
var party = new model_t.Party();
var candidate = new model_t.Candidate();

$(document).ready(function() {
    /*************** load DOMs ***************/
    addOption(states_base);

    /*************** main content ***************/
    var conditions = new model_t.Conditions();

    var stateRequest = $.get(state.url);
    var partyRequest = $.get(party.url);
    var candidateRequest = $.get(candidate.url);
    stateRequest.done(function(data) {
        stateJSON = data;
    });
    partyRequest.done(function(data) {
        partyJSON = data;
    });
    candidateRequest.done(function(data) {
        candidateJSON = data;
    });
    $.when(stateRequest, partyRequest, candidateRequest).done(function() {
        // better experience when demo
        // $('#loading').delay(1000).fadeOut();
        // $('#loading').fadeOut();
        // $(".container").fadeIn();

        state.attributes = stateJSON;

        party.attributes = partyJSON;
        candidate.attributes = candidateJSON;

        var data = {
            "States": state,
            "Candidates": candidate,
            "Parties": party
        };

        var keys = new model_t.Keywords();
        keys.loadNewKeys(conditions, data);
        console.log(keys);
        var con = new model_t.Con(data, keys);
        var bar = new View.BarSetView({
            model: con
        });
        bar.render(con);
        bar.listenTo(con, "change", bar.clear);
        bar.listenTo(con, "change", bar.render);
        var lineSet = new model_t.LineSet();
        lineSet.loadLines(conditions, data, keys);
        var lineView = new view_t.LineSetView({
            collection: lineSet
        });
        lineView.render();

        conditions.on("change", function() {
            keys.loadNewKeys(conditions, data);
            lineSet.loadLines(conditions, data, keys);
            lineView.render();
        });
        console.log(keys);

        $(".xScale .tick").mouseover(lineView.modifyTips);
        $(".xScale .tick").mouseout(lineView.recoverTips);
        $("#line-chart").mouseenter(lineView.showTips);
        $("#line-chart").mouseleave(lineView.removeTips);

        $("#line-time-range li").click(function() {
            var clicked = $(this).children().html().toLowerCase();
            var origin = lineSet.attributes["time_range"];
            if (clicked != origin) {
                lineSet.setTimeRange(clicked);
                $("#line-time-range #" + origin).removeClass("active");
                $("#line-time-range #" + clicked).addClass("active");
            }
            lineView.render();
            $(".xScale .tick").mouseover(lineView.modifyTips);
            $("#line-chart").mouseenter(lineView.showTips);
            $("#line-chart").mouseleave(lineView.removeTips);
            console.log(lineSet);
        });

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
                conditions.set("category", "States", {
                    silent: true
                });
                addOption(states_base);
                break;
            case "Parties":
                conditions.set("category", "Parties", {
                    silent: true
                });
                addOption(parties_base);
                break;
            case "Candidates":
                conditions.set("category", "Candidates", {
                    silent: true
                });
                addOption(candidates_base);
                break;
        };
        conditions.set("option_1", $("div#option-1 select").val(), {
            silent: true
        });
        conditions.set("option_2", $("div#option-2 select").val());
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

    $("#bar-time-range li").click(function() {
        var clicked = $(this).children().html().toLowerCase(),
            origin = conditions.get("time_range");
        if (clicked != origin) {
            conditions.set("time_range", clicked);
            $("#bar-time-range #" + origin).removeClass("active");
            $("#bar-time-range #" + clicked).addClass("active");
        }
    });

});

function addOption(data) {
    for (var i = 0; i < data.length; i++) {
        $("div#option-1 select").append("<option value='" + data[i] + "'>" + data[i] + "</option>");
        $("div#option-2 select").append("<option value='" + data[i] + "'>" + data[i] + "</option>");
    };
    $("div#option-1 select").val(data[0]);
    $("div#option-2 option[value='" + data[0] + "']").prop('disabled', true);
    $("div#option-2 select").val(data[1]);
    $("div#option-1 option[value='" + data[1] + "']").prop('disabled', true);
    $("div#option-1 select").selectpicker('refresh');
    $("div#option-2 select").selectpicker('refresh');
    $('#option-1 button').attr("class", "btn dropdown-toggle btn-primary");
    $('#option-2 button').attr("class", "btn dropdown-toggle btn-info");
}
