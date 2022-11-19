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
import { Line } from 'react-chartjs-2';

import theme from './theme';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

export default function Graph({
	data,
	years,
	name,
	yAxisName,
}: {
	data: number[];
	years: number[];
	name: string;
	yAxisName: string;
}) {
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
	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: name,
			},
		},
	};
	return (
		<Line
			data={chartData}
			options={{
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: name,
					},
				},
				scales: {
					y: {
						title: {
							display: true,
							text: yAxisName,
						},
					},
				},
			}}
		/>
	);
}
