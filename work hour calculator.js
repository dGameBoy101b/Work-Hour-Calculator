//Add a row to the expenses table
function addExpense()
{
	const template_row = $('#expense-template').contents();
	const table_body = $('#expense-body');
	var new_row = template_row.clone();
	new_row.find('[name]').attr('name', function(i, val){ return val + table_body.children().length; });
	table_body.append(new_row);
}
//Remove the expense row the given button is in
function removeExpense(expense_button)
{
	var remove_row = $(expense_button).parents('tr');
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
//Calculate the total listed expenses and output it
function calcExpenseTotal()
{
	if ($('[name^="expense"]:invalid').length > 0)
	{
		alert("Invalid expense data");
		return;
	}
	const total_output = $('[name="expense-total-amount"]');
	const total_unit = $('[name="expense-total-unit"]').val();
	const units = $('[name^="expense-unit"]').map(function(i, ele){ return ele.value; }).get();
	const amounts = $('[name^="expense-amount"]').map(function(i, ele){ return parseFloat(ele.value); }).get();
	var total = 0;
	for (const i in units)
	{
		total += convertAmount(units[i], total_unit, amounts[i]);
	}
	total_output.val(total);
}
//Convert given amount from given source unit to given destination unit
function convertAmount(dst, src, val)
{
	if (src === dst)
	{
		return val;
	}
	const units = ['hour', 'day', 'week', 'fortnight', 'month', 'year'];
	const factors = [24, 7, 2, 2, 12];
	var value = val;
	const src_i = units.indexOf(src);
	if (src_i < 0)
	{
		throw 'invalid source unit';
	}
	const dst_i = units.indexOf(dst);
	if (dst_i < 0)
	{
		throw 'invalid destination unit';
	}
	if (src_i > dst_i)
	{
		for (const mod of factors.slice(dst_i, src_i))
		{
			value *= mod;
		}
	}
	else
	{
		for (const mod of factors.slice(src_i, dst_i))
		{
			value /= mod;
		}
	}
	return value;
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