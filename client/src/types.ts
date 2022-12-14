export type DataPoint = {
	year: number;
	value: number;
};

export type DataSeries = {
	id: string;
	name: string;
	yAxisName: string;
	points: DataPoint[];
};

export type Dataset = {
	type: 'dataset' | 'article';
	id: string;
	name: string;
	date?: number;
	link?: string;
};

export const API_URL = new URL('http://10.248.156.229');
