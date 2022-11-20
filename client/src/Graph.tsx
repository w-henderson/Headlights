import axios from 'axios';
import {
	CategoryScale,
	Chart as ChartJS,
	ChartData,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import flattenDataSeries from './flattenDataSeries';

import theme from './theme';
import { API_URL, DataSeries } from './types';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

export default function Graph({
	id,
	start,
	end,
}: {
	id: string;
	start: number;
	end: number;
}) {
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
	const [years, data] = flattenDataSeries(dataSeries ? dataSeries.points : []);
	const chartData: ChartData<'line', number[], number> = {
		labels: years,
		datasets: [
			{
				data: data,
				fill: false,
				borderColor: theme.palette.primary.main,
			},
		],
	};
	return (
		<Line
			data={chartData}
			options={{
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: dataSeries?.name,
					},
				},
				scales: {
					y: {
						title: {
							display: true,
							text: dataSeries?.yAxisName,
						},
					},
				},
			}}
		/>
	);
}
