//Add a row to the body of the table the given element is in
function addRow(ele)
{
	const table = $(ele).parents('table');
	const template_row = table.find('template').contents();
	const table_body = table.find('tbody');
	var new_row = template_row.clone();
	new_row.find('[name]').attr('name', function(i, val){ return val + table_body.children().length; });
	table_body.append(new_row);
}
//Remove the row the given element is in from the table body
//Also changes the names of the elements in the remaining rows to be correctly indexed
function removeRow(ele)
{
	var remove_row = $(ele).parents('tr').first();
	const index = remove_row.find('[name]').first().attr('name').match(/[0-9]+$/)[0];
	const table_body = remove_row.parents('tbody');
	remove_row.remove();
	table_body.children().each(function(i, ele)
	{
		if (i < index)
		{
			return;
		}
		$(ele).find('[name]').attr('name', function(i, val){
			const num_i = val.search(/[0-9]$/);
			return val.slice(0, num_i) + (parseInt(val.substr(num_i)) - 1);
		});
	});
}
//Calculate the total amounts per their corresponding frequency listed under the given section name
//Every element whose name is prefixed with the given section name thus matching /^section_name\./ is used as input or output
//The total amount is outputted to an element suffixed with total-amount thus matching /^section_name\.total-amount$/
//The total frequency is fetched from an element suffixed with total-frequency thus matching /^section_name\.total-frequency$/
//Each listed item is assumed to have an amount and a frequency named as such with an index suffix matching /^section_name\.amount[0-9]+$/ and /^section_name\.frequency[0-9]+$/ respectively
//See the convertTime function for the supported time frequencies
function calcPerTimeTotal(section_name)
{
	if ($('[name^="' + section_name + '"]:invalid').length > 0)
	{
		alert('Invalid ' + section_name + ' data');
		return;
	}
	const total_output = $('[name="' + section_name + '.total-amount"]');
	const total_frequency = $('[name="' + section_name + '.total-frequency"]').val();
	const frequencies = $('[name^="' + section_name + '.frequency"]').map(function(i, ele){ return ele.value; }).get();
	const amounts = $('[name^="' + section_name + '.amount"]').map(function(i, ele){ return parseFloat(ele.value); }).get();
	var total = 0;
	for (const i in frequencies)
	{
		total += convertTime(amounts[i], frequencies[i], total_frequency);
	}
	total_output.val(total);
}
//Convert given time from given source unit to given destination unit
//Supported units: hour, day, week, fortnight, month, year
function convertTime(val, dst, src)
{
	if (src === dst)
	{
		return val;
	}
	const dst_to_src = {
		'hour':{
			'day':24,
			'week':24*7,
			'fortnight':24*7*2,
			'month':30*24,
			'year':365*24
		},
		'day':{
			'week':7,
			'fortnight':7*2,
			'month':365/12,
			'year':365
		},
		'week':{
			'fortnight':2,
			'month':365/12/7,
			'year':365/7
		}, 
		'fortnight':{
			'month':365/12/7/2,
			'year':365/7/2
		}, 
		'month':{
			'year':12
		}
	};
	if (src in dst_to_src && dst in dst_to_src[src])
	{
		return val / dst_to_src[src][dst];
	}
	return val * dst_to_src[dst][src];
}
//Trim trailing and leading zeros from given input field
function trimZeros(field)
{
	field.value = parseFloat(field.value);
	if (field.value == NaN || field.value.length < 1)
	{
		field.value = 0;
	}
}