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
		flattenDataSeries(example)[0]
	);
	const [years, setYears] = React.useState<number[]>(
		flattenDataSeries(example)[1]
	);

	const [yAxisName, setYAxis] = React.useState('');

	const [datasetID, setID] = React.useState('');
	const [datasetName, setName] = React.useState('');
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
			})
			.catch(error => console.error(error));
	}, []);

	React.useEffect(() => {
		axios
			.get<DataSeries>(new URL('/api/v1/data/series', API_URL).toString(), {
				params: {
					id: datasetID,
					start: startYear,
					end: endYear,
				},
			})
			.then(response => {
				console.log(response.data);
				const [y, dv] = flattenDataSeries(response.data.points);
				setYears(y);
				setData(dv);
				setYAxis(response.data.name);
			})
			.catch(error => console.error(error));
	}, []);

	return (
		<Container maxWidth='md' sx={{ mt: 3 }}>
			<Grid container spacing={2} sx={{ height: '100%' }}>
				<Grid xs={12} md={6}>
					<Typography variant='h3'>{datasetName}</Typography>
				</Grid>
				<Grid xs={12} md={6}>
					<Typography variant='h2'>Right Column</Typography>
				</Grid>
			</Grid>
		</Container>
	);
}
