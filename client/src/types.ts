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
	type: 'dataset';
	id: string;
	name: string;
};
