import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArticleIcon from '@mui/icons-material/Article';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL, Dataset } from './types';
import { format } from 'date-fns';
import theme from './theme';

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
		let ignore = false;
		// if (inputValue != '') {
		axios
			.get<Dataset[]>(new URL('/api/v1/search', API_URL).toString(), {
				params: {
					q: inputValue,
					start: start,
					end: end,
				},
			})
			.then(response => {
				if (!ignore) {
					setOptions(response.data);
				}
			});
		return () => {
			ignore = true;
		};
		// }
	}, [inputValue, start, end]);
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
				<TextField
					{...params}
					label='Search for a dataset or article'
					fullWidth
					style={{ background: theme.palette.background.paper, borderRadius: 16, boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }} />
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
