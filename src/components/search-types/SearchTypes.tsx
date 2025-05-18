import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import BedIcon from '@mui/icons-material/Bed';
import FlightIcon from '@mui/icons-material/Flight';

export const SearchTypes: React.FC = () => {
  const [value, setValue] = React.useState('one');
  
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Search types"
      >
        <Tab value="one" icon={<BedIcon fontSize='small' />} />
        <Tab value="two" icon={<FlightIcon fontSize='small' />} />
      </Tabs>
    </Box>
  );
};