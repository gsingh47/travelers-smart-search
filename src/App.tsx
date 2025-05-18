import React from 'react';
import './App.css';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { ChromeStorageKey } from './background/background';
import { SmartSearch } from './components/SmartSearch';

const App: React.FC = () => {
  const theme = useTheme();
  const isLargeBreakpoint = useMediaQuery('(min-width:1994px)');

  React.useEffect(() => {
    chrome.storage.local.set({[ChromeStorageKey.INIT]: true});
  }, []);

  return (
    <div>
      <Box 
        sx={{ 
          zIndex: 99999, 
          position: 'absolute', 
          left: isLargeBreakpoint ? '92%' : '70.5%', 
          top: isLargeBreakpoint ? '0' : '6.5%', 
          minWidth: '20%' 
        }} 
        component={'section'}
      >
        <SmartSearch />
      </Box>
    </div>
  );
}

export default App;
