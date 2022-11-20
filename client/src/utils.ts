import axios from 'axios';
import { useEffect, useState } from 'react';
import flattenDataSeries from './flattenDataSeries';
import { API_URL, DataPoint, DataSeries } from './types';

export const useDataSeries = (id: string, start: number, end: number) => {
	const [dataSeries, setDataSeries] = useState<DataSeries>();
	useEffect(() => {
		let ignore = false;
		console.log('requesting series');
		axios
			.get<DataSeries>(new URL('/api/v1/data/series', API_URL).toString(), {
				params: {
					id,
					start,
					end,
				},
			})
			.then(response => {
				if (!ignore) {
					setDataSeries(response.data);
				}
			})
			.catch(error => console.error('error in requesting series: ' + error));
		return () => {
			ignore = true;
		};
	}, [id, start, end]);
	return flattenDataSeries(dataSeries ? dataSeries.points : []);
};

export const useDataPoint = (id: string, year: number) => {
	const [dataPoint, setDataPoint] = useState<DataPoint>();
	useEffect(() => {
		let ignore = false;
		console.log('requesting series');
		axios
			.get<DataPoint>(new URL('/api/v1/data/point', API_URL).toString(), {
				params: {
					id,
					time: year,
				},
			})
			.then(response => {
				if (!ignore) {
					setDataPoint(response.data);
				}
			})
			.catch(error => console.error('error in requesting series: ' + error));
		return () => {
			ignore = true;
		};
	}, [id, year]);

	return dataPoint?.value;
};
