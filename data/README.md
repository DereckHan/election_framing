# json file description

## format

Json state
- `state_set`: `list`
	+ 'state': 'string'
	+ 'topic_set':'list':
		+'topic':'string'
		+'time_set':'list':
			+'time_type':'string'
			+'term_set':'list':
				+'term':'string'
				+'score_set':'list':
					+'score':'float'

Json candidate
- `candidate_set`: `list`
	+ 'candidate': 'string'
	+ 'topic_set':'list':
		+'topic':'string'
		+'time_set':'list':
			+'time_type':'string'
			+'term_set':'list':
				+'term':'string'
				+'score_set':'list':
					+'score':'float'

Json party
- `party_set`: `list`
	+ 'party': 'string'
	+ 'topic_set':'list':
		+'topic':'string'
		+'time_set':'list':
			+'time_type':'string'
			+'term_set':'list':
				+'term':'string'
				+'score_set':'list':
					+'score':'float'

## description

`state_set`: 52 states for the election;

`candidate_set`: 26 candidates for the election;

`party_set`: Democrate and Republican;

`topic_set`: list of 8 'topic' object;

`time_set`: day,week,month;

`term_set`: list of 5 'term' object for the selection;

`score_set`: list of 7 'score' object for the latest week;
