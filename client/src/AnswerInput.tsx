import { Slider, Container, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { useDataPoint, useDataSeries } from './utils';
import theme from './theme';

export default function AnswerInput({
	id,
	start,
	end,
	question,
	callbackfn,
}: {
	id: string;
	start: number;
	end: number;
	question: number;
	callbackfn: (correct: boolean) => void;
}) {
	const [years, data] = useDataSeries(id, start, end);
	const correctValue = useDataPoint(id, question);
	const [value, setValue] = useState([-25, 25]);
	const calculateValue = (value: number) => {
		if (years.length != 0 && data.length != 0) {
			const min = Math.min(...data);
			const max = Math.max(...data);
			const mean = data.reduce((acc, value) => acc + value) / data.length;
			return (value / 100) * (max - min) * 4 + mean;
		} else {
			return value;
		}
	};
	return (
		<Container maxWidth='md'>
			<Grid container style={{
				background: theme.palette.background.paper,
				borderRadius: 16,
				boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
			}}>
				<Grid>Give your 90% confidence interval:</Grid>
				<Grid xs>
					<Slider
						value={value}
						min={-50}
						max={50}
						disabled={years.length == 0}
						onChange={(event, newValue: number | number[]) => {
							setValue(newValue as number[]);
						}}
						scale={calculateValue}
						valueLabelDisplay='on'
						valueLabelFormat={value => value.toFixed(2)}
					/>
				</Grid>
				<Grid>
					<Button
						disabled={typeof correctValue == 'undefined'}
						onClick={() => {
							if (typeof correctValue != 'undefined') {
								callbackfn(
									calculateValue(value[0]) < correctValue &&
									calculateValue(value[1]) > correctValue
								);
							}
						}}
					>
						Submit
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
}
