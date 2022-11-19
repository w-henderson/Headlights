import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL, Dataset } from './types';

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
				newValue && callbackfn(newValue);
			}}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			renderInput={params => (
				<TextField {...params} label='Search for a dataset' fullWidth />
			)}
		/>
	);
}
