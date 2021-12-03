/**
 * Add a row to the body of the table the given element is in by duplicating the template row
 * @param {HTMLElement} ele The element in the table to add a row to
 */
function addRow(ele)
{
	const table = $(ele).parents('table');
	const template_row = table.find('template').contents();
	const table_body = table.find('tbody');
	var new_row = template_row.clone();
	new_row.find('[name]').attr('name', function(i, val){ return val + table_body.children().length; });
	table_body.append(new_row);
}
/**
 * Remove the row the given element is in from the table body
 * @description Also changes the names of the elements in the remaining rows to be correctly indexed
 * @param {HTMLElement} ele The element in the row to remove
 */
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
function calcPerTimeTotalInSection(section_name)
{
	if (!validateSection(section_name))
	{
		return;
	}
	const total_output = $('[name="' + section_name + '.total-amount"]');
	const total_frequency = new TimeUnit($('[name="' + section_name + '.total-frequency"]').val());
	const frequencies = $('[name^="' + section_name + '.frequency"]').map(function(i, ele){ return new TimeUnit(ele.value); }).get();
	const amounts = $('[name^="' + section_name + '.amount"]').map(function(i, ele){ return parseFloat(ele.value); }).get();
	var items = [];
	for (const i in frequencies)
	{
		items.push({'amount': amounts[i], 'frequency': frequencies[i]});
	}
	total_output.val(calcPerTimeTotal(total_frequency, items));
}
/** 
 * Calculate the total of the given items in the given TimeUnit
 * @param {TimeUnit} total_frequency The TimeUnit the total should be calculated as
 * @param {[{amount:Number, frequency:TimeUnit}]} items The amounts to be totaled with associated frequiencies
 * @returns The total of the given items in the given total TimeUnit
 * @see TimeUnit
 */
function calcPerTimeTotal(total_frequency, items)
{
	var total = 0;
	for (const ele of items)
	{
		total += ele.amount * total_frequency.convert(ele.frequency);
	}
	return total;
}
/**
 * Trim trailing and leading zeros from given input field
 * @param {HTMLElement} field The input element whose value should be trimmed of zeros
 */
function trimZeros(field)
{
	field.value = parseFloat(field.value);
	if (field.value == NaN || field.value.length < 1)
	{
		field.value = 0;
	}
}
/** 
 * Check the validity of the elements with the given section name prefix
 * @param {String} section_name The name for the section to validate
 * @returns True if valid; False if invalid
 */
function validateSection(section_name)
{
	if ($('[name^="' + section_name + '."]:invalid').length > 0)
	{
		alert('Invalid ' + section_name + ' data');
		return false;
	}
	return true;
}
/**
 * Calculate the weighted average of the given section
 * @param {String} section_name The name of the section to calculate the average of
 * @returns The elements the calculated average was outputted to
 */
function calcPerTimeAverageInSection(section_name)
{
	if (!validateSection(section_name))
	{
		return;
	}
	const average_amount = $('[name="' + section_name + '.average-amount"]');
	const average_frequency = new TimeUnit($('[name="' + section_name + '.average-frequency"]').val());
	const amounts = $('[name^="' + section_name + '.amount"]').map(function(i, ele){ return parseFloat(ele.value); }).get();
	const frequencies = $('[name^="' + section_name + '.frequency"]').map(function(i, ele){ return new TimeUnit(ele.value); }).get();
	const weights = $('[name^="' + section_name + '.weight"]').map(function(i, ele){ return parseFloat(ele.value); }).get();
	var items = [];
	for (const i in amounts)
	{
		items.push({'amount': amounts[i], 'frequency': frequencies[i], 'weight': weights[i]});
	}
	average_amount.val(calcPerTimeAverage(average_frequency, items));
	return average_amount;
}
/**
 * Average the given weighted amounts converted to the given frequency
 * @param {Number} avg_frequency 
 * @param {[{amount:Number, frequency:TimeUnit, weight:Number}]} items The weighted amounts with associated frequencies to average
 * @returns The average of the given items converted to the given frequency
 */
function calcPerTimeAverage(avg_frequency, items)
{
	var total = 0;
	var total_weight = 0;
	for (const item of items)
	{
		total += item.amount * item.weight * item.frequency.convert(avg_frequency);
		total_weight += item.weight;
	}
	if (total_weight === 0)
	{
		return 0;
	}
	return total / total_weight;
}