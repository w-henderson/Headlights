import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import { Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { DataPoint, DataSeries } from '../src/types';
import flattenDataSeries from '../src/flattenDataSeries';

import { Line } from 'react-chartjs-2';
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
import theme from '../src/theme';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

const API_URL = new URL('http://10.248.143.66');

type start = {
	id: string;
	name: string;
	start: number;
	end: number;
	question: number;
};

const example: DataPoint[] = [
	{
		year: 2000,
		value: 1,
	},
	{
		year: 2001,
		value: 2,
	},
	{
		year: 2003,
		value: 3,
	},
	{
		year: 2004,
		value: 4,
	},
];

export default function Home() {
	const [dataValues, setData] = React.useState<number[]>(
		flattenDataSeries(example)[1]
	);
	const [years, setYears] = React.useState<number[]>(
		flattenDataSeries(example)[0]
	);

	const [yAxisName, setYAxis] = React.useState('');

	const [datasetID, setID] = React.useState('');
	const [datasetName, setName] = React.useState('loading');
	const [startYear, setStart] = React.useState<number>();
	const [endYear, setEnd] = React.useState<number>();
	const [question, setQuestion] = React.useState<number>();

	React.useEffect(() => {
		axios
			.get<start>(new URL('/api/v1/start', API_URL).toString())
			.then(response => {
				console.log(response.data);
				setID(response.data.id);
				setName(response.data.name);
				setStart(response.data.start);
				setEnd(response.data.end);
				setQuestion(response.data.question);
				axios
					.get<DataSeries>(new URL('/api/v1/data/series', API_URL).toString(), {
						params: {
							id: response.data.id,
							start: response.data.start,
							end: response.data.end,
						},
					})
					.then(response => {
						console.log(response.data);
						const [y, dv] = flattenDataSeries(response.data.points);
						setYears(y);
						setData(dv);
						setYAxis(response.data.name);
					})
					.catch(error =>
						console.error('error in requesting series: ' + error)
					);
			})
			.catch(error => console.error('error in start: ' + error));
	}, []);

	React.useEffect(() => {}, []);

	const labels = [2004, 2005, 2006, 2007];
	// const data = {
	// 	labels: labels,
	// 	datasets: [
	// 		{
	// 			label: 'My First Dataset',
	// 			data: [1, 2, 3, 4],
	// 			fill: false,
	// 			borderColor: 'rgb(75, 192, 192)',
	// 			tension: 0.1,
	// 		},
	// 	],
	// };
	const data: ChartData<'line', number[], number> = {
		labels: years,
		datasets: [
			{
				data: dataValues,
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
				text: datasetName,
			},
		},
	};
	return (
		<Container maxWidth='md' sx={{ mt: 5 }}>
			<Grid container spacing={2} sx={{ height: '100%' }}>
				<Grid xs={12} md={6}>
					<Typography variant='h5'>{datasetName}</Typography>
					<Line data={data} options={options} />
				</Grid>
				<Grid xs={12} md={6}>
					<Typography variant='h2'>Right Column</Typography>
				</Grid>
			</Grid>
		</Container>
	);
}
