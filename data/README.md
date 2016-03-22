# json file description

## format

Json obj
- `term_count`: `int`
- `time_frame`: `int`
- `date_start`: `string`
- `date`: `string`
- `term_set`: `list`
	+ `term`: `string`
    + `scores_1`: `list`
    + `scores_2`: `list`


## description

`term_count`: total count of terms, 5 for most situation;

`time_frame`: length of the time frame ({day:1, week:7, month: 30}), equals to the length of score list;

`date`: present date;

`date_start`: begining date of the time frame. if time frame equals to 1, `date_start` equals to `date`;

`term_set`: list of `term object`;

each `term object` is constructed by:
- `term`: keyword;
- `scores_1/2`: sentimental scores of two groups (length equals to `time_frame`), ordered by time from `date_start` to `date`.