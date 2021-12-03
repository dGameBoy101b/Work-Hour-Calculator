/** 
 * An enumeration class which provides additional conversion methods
 */
class TimeUnit
{
	static HOUR = new TimeUnit('hour');
	static DAY = new TimeUnit('day');
	static WEEK = new TimeUnit('week');
	static FORTNIGHT = new TimeUnit('fortnight');
	static MONTH = new TimeUnit('month');
	static YEAR = new TimeUnit('year');
	/** 
	 * Construct new TimeUnit with the given string value
	 * @hideconstructor
	 * @param {String} val The string value of the new TimeUnit
	 */
	constructor(val)
	{
		const allowed = new Set(['hour', 'day', 'week', 'fortnight', 'month', 'year']);
		if (!allowed.has(val))
		{
			throw '"' + val + '" not a supported TimeUnit value';
		}
		this.value = val;
	}
	/** 
	 * Get a string representation of this
	 * @returns The string representation of this
	 */
	toString()
	{
		return 'TimeUnit.' + this.value.toUpper();
	}
	/** 
	 * Return the conversion factor for converting from this to the given TimeUnit
	 * @param {TimeUnit} dst The desitnation TimeUnit for the conversion
	 * @returns The factor needed to convert from this to the given TimeUnit
	 */
	convert(dst)
	{
		if (! dst instanceof TimeUnit)
		{
			dst = TimeUnit(dst);
		}
		if (this.value == dst.value)
		{
			return 1;
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
		if (this.value in dst_to_src && dst.value in dst_to_src[this.value])
		{
			return 1 / dst_to_src[this.value][dst.value];
		}
		return dst_to_src[dst.value][this.value];
	}
}