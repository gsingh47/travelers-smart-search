import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, Card, CardContent, CardHeader, Fab, IconButton, Popover, Stack, TextField, Typography } from '@mui/material';
import { getSearchCriteria } from '../utils/speech-to-text';
import { useVoiceSearchContext } from '../provider/VoiceSearchProvider';
import { Suggestions } from './suggestions/Suggestions';
import { SearchTools } from './search-tools/SearchTools';
import { ActionType } from '../provider/actions';
import { Chrome_Cache_Key, RECENT_SEARCHES_LIMIT, RecentSearchesType } from '../types/common';
import { SearchTypes } from './search-types/SearchTypes';
import { runSearch, waitForElementToDisappear } from './utils/bookingcom-runners';

const DEFAULT_INPUT_PLACEHOLDER = 'E.g. Search hotels in new york.';
const DEFAULT_INPUT_LABEL = 'Prompt';


export type TranscriptComponentState = {
  transcript?: string;
  finalTranscript?: string;
};

export const SmartSearch: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [searchText, setSearchText] = React.useState<string>();
  const { state, dispatch } = useVoiceSearchContext();
  const { title, titleColor } = { title: undefined, titleColor: undefined };
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (state.searchClicked) {
      (async () => {
        let resp = undefined;
        if (false) { // TODO: check if search input is ready
          resp = await getSearchCriteria(""); // TDOD: get the search input
        }

        if (resp && resp.success && !resp.error) {
          const cachedResp = await chrome.storage.local.get(Chrome_Cache_Key.RECENT_SEARCHES);

          if (cachedResp && cachedResp.recentSearches) {
            const recentSearches: RecentSearchesType[] = cachedResp.recentSearches;
            recentSearches.splice(0, 0, {title: resp.results.searchTitle, url: resp.results.url});
            const updatedSearches = recentSearches.length > RECENT_SEARCHES_LIMIT ? recentSearches.slice(0, recentSearches.length - 1) : recentSearches;
            chrome.storage.local.set({[Chrome_Cache_Key.RECENT_SEARCHES]: updatedSearches});
            
          } else {
            chrome.storage.local.set({[Chrome_Cache_Key.RECENT_SEARCHES]: [{title: resp.results.searchTitle, url: resp.results.url}]});
          }
          
          window.location.href = resp.results.url;
        } else {
          dispatch({ type: ActionType.ERROR, payload: { message: resp.error }});
        }

        dispatch({ type: ActionType.FETCHING, payload: false });
        dispatch({ type: ActionType.SEARCH, payload: false });
      })();
    }
  }, [state.searchClicked]);

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

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
  };

  const handleSearchClick = async () => {
    if (searchText) {
      setAnchorEl(null);
      
      waitForElementToDisappear('#smart-search-popover').then((elementDisappeared) => {
        if (elementDisappeared) {
          runSearch(searchText);
        } else {
          console.error('Popover did not close in time'); // TODO: set error state
        }
      });
    }
  };

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
            title={<SearchTypes />}
          />
          <CardContent>
            <Box sx={{ minHeight: 300,  maxHeight: 300 }}>
              <Box sx={{ minHeight: 100, maxHeight: 100, paddingBlockEnd: 2 }}>
                <TextField 
                  label={DEFAULT_INPUT_LABEL} 
                  variant="filled" 
                  rows={5} 
                  placeholder={DEFAULT_INPUT_PLACEHOLDER}
                  fullWidth 
                  multiline
                  value={searchText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </Box>
              {/* Search, reset button */}
              {state.isReady && <SearchTools isContentAvailable={true} />}
              {/* Suggestions */}
              {/* {<Suggestions isContentAvailable={false} />} */}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fab onClick={handleSearchClick} size='medium' color={'primary'} variant='extended'>
                <Typography sx={{ textTransform: 'none' }} noWrap>Search</Typography>
              </Fab>
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </Stack>
  )
};