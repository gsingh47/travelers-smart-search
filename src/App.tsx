import React from 'react';
import './App.css';
import { Box, useMediaQuery } from '@mui/material';
import { VoiceSearchWrapper } from './components/VoiceSearchWrapper';
import { useTheme } from '@emotion/react';

const App: React.FC = () => {
  const theme = useTheme();
  const isLargeBreakpoint = useMediaQuery('(min-width:1994px)');

  React.useEffect(() => {
    console.log(isLargeBreakpoint, theme);
  }, [isLargeBreakpoint, theme]);

  return (
    <div>
      <Box 
        sx={{ 
          zIndex: 99999, 
          position: 'absolute', 
          left: isLargeBreakpoint ? '80%' : '70.5%', 
          top: isLargeBreakpoint ? '0' : '6.5%', 
          minWidth: '20%' 
        }} 
        component={'section'}
      >
        <VoiceSearchWrapper />
      </Box>
    </div>
  );
}

export default App;
