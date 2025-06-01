import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import BedIcon from '@mui/icons-material/Bed';
import FlightIcon from '@mui/icons-material/Flight';
import { useSmartSearchContext } from '../../provider/SmartSearchProvider';
import { ActionType } from '../../provider/actions';
import { SearchType } from '../../constants/constants';

export const SearchTypes: React.FC = () => {
  const [value, setValue] = React.useState(SearchType.HOTELS);
  const { dispatch } = useSmartSearchContext();
  
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    dispatch({ type: ActionType.SEARCH_TYPE_CHANGE, payload: newValue });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Search types"
      >
        <Tab value={SearchType.HOTELS} icon={<BedIcon fontSize='small' />} />
        <Tab value={SearchType.FLIGHTS} icon={<FlightIcon fontSize='small' />} />
      </Tabs>
    </Box>
  );
};