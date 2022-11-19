import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArticleIcon from '@mui/icons-material/Article';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL, Dataset } from './types';
import { format } from 'date-fns';

export default function SearchBar({
	start,
	end,
	callbackfn,
}: {
	start: number;
	end: number;
	callbackfn: (dataset: Dataset) => void;
}) {
	const [options, setOptions] = useState<Dataset[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [value, setValue] = useState<Dataset>();
	useEffect(() => {
		if (inputValue != '') {
			axios
				.get<Dataset[]>(new URL('/api/v1/search', API_URL).toString(), {
					params: {
						q: inputValue,
						start: start,
						end: end,
					},
				})
				.then(response => {
					setOptions(response.data);
				});
		}
	}, [inputValue]);
	return (
		<Autocomplete
			filterOptions={x => x}
			options={options}
			getOptionLabel={option => option.name}
			onChange={(event: any, newValue) => {
				setValue(newValue ? newValue : undefined);
				newValue && newValue.type == 'dataset' && callbackfn(newValue);
			}}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			renderInput={params => (
				<TextField {...params} label='Search for a dataset' fullWidth />
			)}
			renderOption={(props, option) => {
				return (
					<li {...props}>
						<Grid container alignItems={'center'}>
							<Grid>
								<Box
									component={
										option.type == 'dataset' ? TimelineIcon : ArticleIcon
									}
									sx={{ color: 'text.secondary', mr: 2 }}
								/>
							</Grid>
							<Grid xs>
								<Typography>
									{option.name}
									{option.date ? ` - (${format(option.date * 1e3, 'y')})` : ''}
								</Typography>
							</Grid>
						</Grid>
					</li>
				);
			}}
		/>
	);
}
