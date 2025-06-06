import React from 'react';
import { Stack, Fab } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import { useSmartSearchContext } from '../../provider/SmartSearchProvider';
import { ActionType } from '../../provider/actions';

type Props = {
  isContentAvailable?: boolean;
};

export const SearchTools: React.FC<Props> = ({ isContentAvailable }) => {
  const { dispatch } = useSmartSearchContext();

  const handleSearchClick = () => {
    dispatch({ type: ActionType.SEARCH, payload: { searchClicked: true } });
    dispatch({ type: ActionType.FETCHING, payload: true });
  };

  if (!isContentAvailable) {
    return null;
  }

  return (
    <Stack direction={'row'} spacing={1} justifyContent={'right'}>
      <Fab size='small' color='default'>
        <RestartAltIcon color='inherit' />
      </Fab>
      <Fab onClick={handleSearchClick} size='small' color='info'>
        <SearchIcon color='inherit' />
      </Fab>
    </Stack>
  );
};