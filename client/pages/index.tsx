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
import AnswerInput from '../src/AnswerInput';

import { binomialDistribution, max } from 'simple-statistics';

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
	yAxisName: string;
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
	const [loading, setLoading] = React.useState(true);

	const [yAxisName, setYAxis] = React.useState('');

	const [datasetID, setID] = React.useState('');
	const [datasetName, setName] = React.useState('loading');
	const [startYear, setStart] = React.useState<number>(1990);
	const [endYear, setEnd] = React.useState<number>(2004);
	const [question, setQuestion] = React.useState<number>();

	const [attempts, setAttempts] = React.useState(0);
	const [correct, setCorrect] = React.useState(0);

	const binom = binomialDistribution(attempts, 0.9);
	const maxBinom = max(binom ? binom : [1]);
	const score = binom
		? binomialDistribution(attempts, 0.9)[correct] / maxBinom
		: 0;

	React.useEffect(() => {
		let ignore = false;
		if (loading) {
			axios
				.get<start>(new URL('/api/v1/start', API_URL).toString())
				.then(response => {
					if (!ignore) {
						console.log(response.data);
						setID(response.data.id);
						console.log(`setting name`);
						setName(response.data.name);
						setStart(response.data.start);
						setEnd(response.data.end);
						setQuestion(response.data.end);
						setYAxis(response.data.yAxisName);

						setLoading(false);
					}
				})
				.catch(error => console.error('error in start: ' + error));
		}
		return () => {
			ignore = true;
		};
	}, [loading]);

	const [searchDatasetID, setSearchID] = React.useState('');
	const [searchDatasetName, setSearchName] = React.useState('');

	return (
		<>
			<Container maxWidth='lg' sx={{ p: 5 }}>
				<Typography variant='h3' align='center' gutterBottom sx={{ mb: 5 }}>
					<strong>
						What is {yAxisName} in {question}? ({score.toFixed(2)})
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
			<Grid container spacing={5} mx={10} my={5} marginTop={0}>
				{!searchDatasetID && <Grid md display={{ xs: 'none', md: 'block' }} />}
				<Grid xs={12} md={9} lg={6}>
					<Paper sx={{
						background: theme.palette.background.paper,
						borderRadius: 4,
						padding: 2
					}} elevation={5}>
						<Typography variant='h5'>{datasetName}</Typography>
						{datasetID ? (
							<Graph id={datasetID} start={startYear} end={endYear} />
						) : (
							<Skeleton height='100%' />
						)}
					</Paper>
				</Grid>
				{!searchDatasetID && <Grid md display={{ xs: 'none', md: 'block' }} />}
				{searchDatasetID && (
					<>
						<Grid md display={{ xs: 'none', md: 'block', lg: 'none' }} />
						<Grid xs={12} md={9} lg={6}>
							<Paper sx={{
								background: theme.palette.background.paper,
								borderRadius: 4,
								padding: 2
							}} elevation={5}>
								<Typography variant='h5'>{searchDatasetName}</Typography>
								<Graph id={searchDatasetID} start={startYear} end={endYear} />
							</Paper>
						</Grid>
						<Grid md display={{ xs: 'none', md: 'block', lg: 'none' }} />
					</>
				)}
				{/* <Grid md display={{ xs: 'none', md: 'block' }} /> */}
				<Grid xs={12} marginTop={5}>
					<AnswerInput
						id={datasetID}
						start={startYear}
						end={endYear}
						question={question ? question : 3000}
						callbackfn={correct => {
							if (correct) {
								setCorrect(prev => prev + 1);
							}
							setAttempts(prev => prev + 1);
							setLoading(true);
						}}
					/>
				</Grid>
				{/* <Grid md display={{ xs: 'none', md: 'block' }} /> */}
			</Grid>
		</>
	);
}
