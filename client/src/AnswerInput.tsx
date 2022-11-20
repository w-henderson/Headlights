import { Slider, Container, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { useDataPoint, useDataSeries } from './utils';
import theme from './theme';
import numeral from 'numeral';

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
			let factor = 4;
			while (
				correctValue! < -0.5 * (max - min) * factor + mean ||
				correctValue! > 0.5 * (max - min) * factor + mean
			) {
				factor++;
			}
			return (value / 100) * (max - min) * factor + mean;
		} else {
			return value;
		}
	};
	return (
		<Container maxWidth='md'>
			<Paper elevation={3} sx={{ borderRadius: 4 }}>
				<Grid container spacing={2} alignItems={'center'}>
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
							valueLabelFormat={value => numeral(value).format('0.00a')}
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
			</Paper>
		</Container>
	);
}
