import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, CardContent, CardHeader, Divider, Fab, IconButton, LinearProgress, Popover, Stack, TextField, Typography } from '@mui/material';
import { useSmartSearchContext } from '../provider/SmartSearchProvider';
import { Suggestions } from './suggestions/Suggestions';
import { SearchTools } from './search-tools/SearchTools';
import { ActionType } from '../provider/actions';
import { Chrome_Cache_Key, RECENT_SEARCHES_LIMIT, RecentSearchesType } from '../types/common';
import { SearchTypes } from './search-types/SearchTypes';
import { runSearch, waitForElementToDisappear } from './utils/bookingcom-runners';
import { getSearchCriteria } from '../utils/get-data-helper';
import { SearchType } from '../constants/constants';

const HOTELS_INPUT_PLACEHOLDER = 'E.g. Search hotels in new york.';
const FLIGHTS_INPUT_PLACEHOLDER = 'E.g. Search flights from LA to new york.';
const DEFAULT_INPUT_LABEL = 'Prompt';


export type TranscriptComponentState = {
  transcript?: string;
  finalTranscript?: string;
};

export const SmartSearch: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [searchText, setSearchText] = React.useState<string>();
  const { state, dispatch } = useSmartSearchContext();
  const showSuggestions = state.searchClicked && state.destinationSuggestions.length;
  const open = Boolean(anchorEl);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchClick();
    }
  }

  const handleBackClick = () => {
    dispatch({ type: ActionType.SET_DESTINATION_SUGGESTIONS, payload: [] });
    dispatch({ type: ActionType.SEARCH, payload: { searchClicked: false } });
  }

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = async () => {
    setAnchorEl(null);
  }

  const handleSearchClick = async () => {
    if (searchText) {
      dispatch({ type: ActionType.FETCHING, payload: true });
      const resp = await getSearchCriteria(searchText);
      
      if (resp && resp.success) {
        const { destinationSuggestions, destinationName } = resp.results;

        if (destinationSuggestions && destinationSuggestions.length) {
          dispatch({
            type: ActionType.SET_DESTINATION_SUGGESTIONS,
            payload: destinationSuggestions
          });
          dispatch({ type: ActionType.SEARCH, payload: { searchClicked: true, searchText: destinationName } });
          dispatch({ type: ActionType.FETCHING, payload: false });
        }
        // TODO: Handle unavailable suggestions case
      } // TODO: Handle error case
    }
  }

  const handleDestinationSelect = (index: number) => {
    setAnchorEl(null);
    waitForElementToDisappear('#smart-search-popover').then((elementDisappeared) => {
      if (elementDisappeared) {
        runSearch(state.searchText, index);
      } else {
        console.error('Popover did not close in time'); // TODO: set error state
      }
    });
  }

  return(
    <Stack sx={{ m: 2 }} direction={'row'} spacing={1}>
      <Fab disabled={open} onClick={handleOpen} variant='extended' size="small" color="default">
        <AutoAwesomeIcon sx={{ height: "20px" }} color={open ? 'inherit' : 'primary'} />
        <Typography sx={{ fontSize: '14px', textTransform: 'none', pr: 0.5 }} noWrap>Smart search</Typography>
      </Fab>
      <Popover
        id={'smart-search-popover'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}  
        sx={{ zIndex: 99999 }}
      >
        {/* body */}
        <Card sx={{ minWidth: 400, maxWidth: 400 }}>
          <CardHeader
            sx={{ pb: 0, mb: 0 }}
            action={
              <IconButton onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            }
            title={showSuggestions ? 
              <ArrowBackIcon onClick={handleBackClick} color='primary' sx={{ cursor: 'pointer', mt: 0.8 }} /> : 
              <SearchTypes />
            }
          />
          <CardContent>
            <Box sx={{ minHeight: 300,  maxHeight: 300 }}>
              {!showSuggestions && 
                <Box sx={{ minHeight: 100, maxHeight: 100, paddingBlockEnd: 2 }}>
                  <TextField 
                    label={DEFAULT_INPUT_LABEL} 
                    variant="filled" 
                    rows={5} 
                    placeholder={state.searchType === SearchType.HOTELS ? HOTELS_INPUT_PLACEHOLDER : FLIGHTS_INPUT_PLACEHOLDER}
                    fullWidth
                    multiline
                    value={searchText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  {/* loader */}
                  {state.isFetching && <LinearProgress />}
                </Box>
              }
              {/* Suggestions */}
              {showSuggestions && <Suggestions onSelect={handleDestinationSelect} />}
            </Box>
            <Divider />
            {/* Search button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              {showSuggestions ?
                <Typography variant="caption" color='secondary' noWrap>For more precise results select the destination.</Typography> : 
                <Fab onClick={handleSearchClick} size='medium' color={'primary'} variant='extended'>
                  <Typography sx={{ textTransform: 'none' }} noWrap>Search</Typography>
                </Fab>
              }
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </Stack>
  )
};