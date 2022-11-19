import { DataPoint } from './types';

export default function flattenDataSeries(data: DataPoint[]) {
	let years: number[] = [];
	let values: number[] = [];
	data.forEach(({ value, year }) => {
		values.push(value);
		years.push(year);
	});
	return [years, values];
}
