import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import { Paper, Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { API_URL, DataPoint, DataSeries } from '../src/types';
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
import Graph from '../src/Graph';
import SearchBar from '../src/SearchBar';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

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
	const [startYear, setStart] = React.useState<number>(2000);
	const [endYear, setEnd] = React.useState<number>(2004);
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
			.catch(error => console.error('error in start: ' + error));
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
				setYAxis(response.data.yAxisName);
			})
			.catch(error => console.error('error in requesting series: ' + error));
	}, [datasetID, startYear, endYear]);

	const [searchDataValues, setSearchData] = React.useState<number[]>([]);
	const [searchYears, setSearchYears] = React.useState<number[]>([]);

	const [searchYAxisName, setSearchYAxis] = React.useState('');

	const [searchDatasetID, setSearchID] = React.useState('');
	const [searchDatasetName, setSearchName] = React.useState('loading');
	const [searchQuestion, setSearchQuestion] = React.useState<number>();

	React.useEffect(() => {
		if (searchDatasetID !== '') {
			axios
				.get<DataSeries>(new URL('/api/v1/data/series', API_URL).toString(), {
					params: {
						id: searchDatasetID,
						start: startYear,
						end: endYear,
					},
				})
				.then(response => {
					console.log(response.data);
					const [y, dv] = flattenDataSeries(response.data.points);
					setSearchYears(y);
					setSearchData(dv);
					setSearchYAxis(response.data.yAxisName);
				})
				.catch(error => console.error('error in requesting series: ' + error));
		}
	}, [searchDatasetID, startYear, endYear]);
	return (
		<>
			<Container maxWidth='lg' sx={{ p: 5 }}>
				<Typography variant='h3' align='center' gutterBottom>
					<strong>
						What is {yAxisName} in {question}?
					</strong>
				</Typography>
				<SearchBar
					start={startYear}
					end={endYear}
					callbackfn={dataset => {
						setSearchID(dataset.id);
						setSearchName(dataset.name);
					}}
				/>
			</Container>
			<Grid container spacing={2} mx={10}>
				<Grid xs={12} md={9} lg={6}>
					<Typography variant='h5'>{datasetName}</Typography>
					{datasetID ? (
						<Graph
							data={dataValues}
							name={datasetName}
							years={years}
							yAxisName={yAxisName}
						/>
					) : (
						<Skeleton height='100%' />
					)}
				</Grid>
				<Grid xs={12} md={9} lg={6}>
					<Typography variant='h5'>{searchDatasetName}</Typography>
					{searchDatasetID && (
						<Graph
							data={searchDataValues}
							name={searchDatasetName}
							years={searchYears}
							yAxisName={searchYAxisName}
						/>
					)}
				</Grid>
			</Grid>
		</>
	);
}
