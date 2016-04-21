# json file description

## format

`state.json`:

- "`time`": `String` - the latest date within the data, in format "`MM/DD/YYYY`"
- "State1": `Object` - all states, detail is listed [here](./source.json).
	+ "`eco`": `Object` - topics, [detail](./README.md#topic-list)
		* "`day`": `Object` - time range that the `term_set` been extracted from
			- "`begin_time`": `String` - the begining date, (same as "`time` here), format "`MM/DD/YYYY`"
			- "`term_set`": `Object`
				+ "term1": `List` - score list, [detail](./README.md#length-of-the-term-list)
				+ "term2": `List`
				+ "term3": `List`
				+ "term4": `List`
				+ "term5": `List`
		* "`week`": `Object`
			- "`begin_time`": "`String`"- the begining date of time range "`week`", in format "`MM/DD/YYYY`"
			- "`term_set`": `Object`
				+ ...
		* "`month`" :`Object`
	+ "`for`": `Object`
		* "`day`": `Object`
			- ...
		* "`week`": `Object`
		* "`month`": `Object`
	+ "`fed`": `Object`
	+ "`equ`": `Object`
	+ "`hea`": `Object`
	+ "`imm`": `Object`
	+ "`env`": `Object`
	+ "`gun`": `Object`
- "State2": `Object`
	+ "`eco`": `Object`
	+ "`for`": `Object`
	+ ...
	+ "`gun`": `Object`
- "State3": `Object`
- "State4": `Object`
- "State5": `Object`
- "State6": `Object`
- ...
- "State50": `Object`

`candidate.json` and `party.json` follow almost the same format as that of `state.json`. Replacing states list with candidate/party list is all need to do.


## description

### topic list

```json
{
	"eco":"Economy",
	"for":"Foreign Policy",
	"fed":"Federal Budget",
	"equ":"Equality",
	"hea":"Health Care",
	"imm":"Immigration",
	"env":"Environment",
	"gun":"Guns"
}
```

### length of the term list

The length of the term set list equels to the number of days in previous month.
