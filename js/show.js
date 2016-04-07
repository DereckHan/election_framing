
var category;
Condition = Backbone.Model.extend({
	defaults : {
		topic : 'eco',
		category : 'state',
		option_1 : 'Alabama',
		option_2 : 'Alaska'
	},
});
var condition = new Condition();
var states = [ "Alabama", "Alaska", "Arizona", "Arkansas", "California",
		"Colorado", "Connecticut", "Delaware", "District of Columbia",
		"Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "lowa",
		"Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
		"Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
		"Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
		"New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
		"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
		"South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
		"Washington", "West Virginia", "Wisconsin", "Wyoming" ];
var candidates = [ "Hillary Clinton", "Bernie Sanders", "Ted Cruz",
		"John Kasich", "Donald J. Trump", "Lincoln Chafee", "Lawrence Lessig",
		"Martin O’Malley", "Jim Webb", "Jeb Bush", "Ben Carson",
		"Chris Christie", "Carly Fiorina", "Jim Gilmore", "Lindsey Graham",
		"Mike Huckabee", "Bobby Jindal", "George Pataki", "Rand Paul",
		"Rick Perry", "Marco Rubio", "Rick Santorum", "Scott Walker",
		"Joseph R. Biden Jr.", "Elizabeth Warren", "Mitt Romney" ];
var parties = [ "Democratic", "Republican" ];
function addOption(data) {

	for (var i = 0; i < data.length; i++) {
		$("div#option-1 select").append("<option value='"+data[i]+"'>" + data[i] + "</option>");
		$("div#option-2 select").append("<option value='"+data[i]+"'>" + data[i] + "</option>");
	}
	;
	$("div#option-1 select").val(data[0]);
	$("div#option-2 option[value='"+data[0]+"']").prop('disabled', true);
	$("div#option-2 select").val(data[1]);
	$("div#option-1 option[value='"+data[1]+"']").prop('disabled', true);
	condition.set("option_1", data[0]);
	condition.set("option_2", data[1]);
	$("div#option-1 select").selectpicker('refresh');
	$("div#option-2 select").selectpicker('refresh');

}
addOption(states);

$("div#topic label").click(function() {
	condition.set("topic", $(this).attr("id"));
});
$("#show").click(
		function() {
			alert("topic: " + condition.get("topic") + "\ncategory: "
					+ condition.get("category") + " \noption-1 :"
					+ condition.get("option_1") + " \noption_2 :"
					+ condition.get("option_2"));
		});
$("div#category select").change(function() {
	category = $(this).val();
	$("div#option-1 select").html("");
	$("div#option-2 select").html("");
	$("div#option-1 select").selectpicker('refresh');
	$("div#option-2 select").selectpicker('refresh');
	switch (category) {
	case "States":
		condition.set("category", "state");
		addOption(states);
		break;
	case "Parties":
		condition.set("category", "party");
		addOption(parties);

		break;
	case "Candidates":
		condition.set("category", "candidate");
		addOption(candidates);
		break;
	}
	;
});
$("div#option-1 select").change(function() {
	var option1 = $(this).val();
	$("div#option-2 option").prop('disabled', false);
	$("div#option-2 option[value='"+option1+"']").prop('disabled', true);
	$("div#option-2 select").selectpicker('refresh');
	condition.set("option_1", $(this).val());
});
$("div#option-2 select").change(function() {
	var option2 = $(this).val();
	$("div#option-1 option").prop('disabled', false);
	$("div#option-1 option[value='"+option2+"']").prop('disabled', true);
	$("div#option-1 select").selectpicker('refresh');
	condition.set("option_2", $(this).val());
});