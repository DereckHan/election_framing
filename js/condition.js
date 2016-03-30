$(document).ready(
		function() {
			var states = [];
			var candidates = [];
			var parties = [];
			Condition = Backbone.Model.extend({
				defaults : {
					topic : 'eco',
					category : 'state',
					option_1 : 'Alabama',
					option_2 : 'Alaska'
				},
			});
			var condition = new Condition();
			$.getJSON('data/source.json', function(data) {
				states = data.dataType[0].data;
				candidates = data.dataType[1].data;
				parties = data.dataType[2].data;

			});

			$("input.topic").click(function() {
				condition.set('topic', $(this).attr("id"));
			});

			$("ul#category-dropdown li").click(function() {
				var index = $(this).text();
				var option1 = document.getElementById("option-1-dropdown");
				var option2 = document.getElementById("option-2-dropdown");
				option1.innerHTML = "";
				option2.innerHTML = "";
				switch (index) {
				case "States":
					condition.set('category', 'state');
					for (var i = 0; i < states.length; i++) {
						var option_1 = document.createElement("li");
						var option_2 = document.createElement("li");
						option_1.innerHTML = states[i];
						option_2.innerHTML = states[i];
						option_1.addEventListener('click', function() {
							condition.set('option_1', $(this).text());
						}, false);
						option_2.addEventListener('click', function() {
							condition.set('option_2', $(this).text());
						}, false);
						option1.appendChild(option_1);
						option2.appendChild(option_2);

					}
					break;
				case "Parties":
					condition.set('category', 'party');
					for (var i = 0; i < parties.length; i++) {
						var option_1 = document.createElement("li");
						var option_2 = document.createElement("li");
						option_1.innerHTML = parties[i];
						option_2.innerHTML = parties[i];
						option_1.addEventListener('click', function() {
							condition.set('option_1', $(this).text());
						}, false);
						option_2.addEventListener('click', function() {
							condition.set('option_2', $(this).text());
						}, false);
						option1.appendChild(option_1);
						option2.appendChild(option_2);

					}
					break;
				case "Candidates":
					condition.set('category', 'candidate');
					for (var i = 0; i < candidates.length; i++) {
						var option_1 = document.createElement("li");
						var option_2 = document.createElement("li");
						option_1.innerHTML = candidates[i];
						option_2.innerHTML = candidates[i];
						option_1.addEventListener('click', function() {
							condition.set('option_1', $(this).text());
						}, false);
						option_2.addEventListener('click', function() {
							condition.set('option_2', $(this).text());
						}, false);
						option1.appendChild(option_1);
						option2.appendChild(option_2);
					}
					break;
				}
			});
		})
