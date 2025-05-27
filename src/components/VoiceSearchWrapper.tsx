import React from 'react';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardContent, CardHeader, CircularProgress, Fab, IconButton, Popover, Stack, Typography } from '@mui/material';
import { pauseRecording, RecorderStatus, resumeRecording, startRecording, stopRecording } from '../utils/speech-to-text';
import { useSmartSearchContext } from '../provider/SmartSearchProvider';
import { getCardTitleText, getDisplayText, getSearchCriteria } from '../utils/get-data-helper';
import { ErrorMsgs } from '../provider/reducer';
import { Suggestions } from './suggestions/Suggestions';
import { SearchTools } from './search-tools/SearchTools';
import { ActionType } from '../provider/actions';
import { Chrome_Cache_Key, MAX_ATTEMPTS, RECENT_SEARCHES_LIMIT, RecentSearchesType } from '../types/common';

export type TranscriptComponentState = {
  transcript?: string;
  finalTranscript?: string;
};

export const VoiceSearchWrapper: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [paused, setPaused] = React.useState(false);
  const { state, dispatch } = useSmartSearchContext();
  const [transcriptState, setTranscriptState] = React.useState<TranscriptComponentState>();
  const open = Boolean(anchorEl);
  const isPaused = state.recorderStatus === RecorderStatus.PAUSED && paused;
  const isFinalContentAvailable = !!transcriptState?.finalTranscript;
  const isContentAvailable = !!transcriptState?.transcript || isFinalContentAvailable;
  const contentBoxHeight = isContentAvailable ? 220 : 100;
  const { title, titleColor } = getCardTitleText(isPaused, state.error);

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  /* Generate new token if connection unauth */
  React.useEffect(() => {
    if (state.sttConnectionClosed && state.sttConnectionClosed.count < MAX_ATTEMPTS) {
      const { code, reason } = state.sttConnectionClosed;
      if (code === 4001 && reason === ErrorMsgs.NOT_AUTHORIZED) {
        startRecording(setTranscriptState, dispatch, true);
      } else {
        dispatch({ type: ActionType.ERROR });
      }
    }
  }, [state.sttConnectionClosed]);

  React.useEffect(() => {
    if (state.searchClicked) {
      (async () => {
        let resp = undefined;
        if (transcriptState) {
          pauseRecording();
          const transcriptText = getDisplayText(transcriptState);
          resp = await getSearchCriteria(transcriptText);
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
          
          stopRecording();
          window.location.href = resp.results.url;
        } else {
          dispatch({ type: ActionType.ERROR, payload: { message: resp.error }});
        }

        dispatch({ type: ActionType.FETCHING, payload: false });
        dispatch({ type: ActionType.SEARCH, payload: false });
      })();
    }
  }, [state.searchClicked]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTranscriptState(undefined);
    setAnchorEl(event.currentTarget);
    startRecording(setTranscriptState, dispatch);
  };

  const handleClose = async () => {
    stopRecording();
    setAnchorEl(null);
  };

  const handlePauseToggle = async () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
    setPaused(!paused);
  };

  return(
    <Stack sx={{ m: 2 }} direction={'row'} spacing={1}>
      <Fab disabled={open} onClick={handleClick} variant='extended' size="small" color="default">
        <MicIcon color={open ? 'inherit' : 'primary'} />
        <Typography sx={{ fontSize: '12px' }}>Voice search flights</Typography>
      </Fab>
      <Popover
        id={'voice-search-popover'}
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
        <Card sx={{ minWidth: 400, maxWidth: 400 }}>
          <CardHeader
            sx={{ pb: 0, mb: 0 }}
            action={
              <IconButton onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            }
            title={title && <Typography color={titleColor}>{title}</Typography>}
          />
          <CardContent>
            <Box sx={{ minHeight: 300,  maxHeight: 300 }}>
              <Box sx={{ minHeight: contentBoxHeight, maxHeight: contentBoxHeight, paddingBlockEnd: 2 }}>
                <Typography variant='body1' fontSize={18} fontFamily='Roboto'>
                  {(!transcriptState?.transcript && !transcriptState?.finalTranscript && !isPaused && state.isReady) && 'Listening...'}
                  {transcriptState && getDisplayText(transcriptState)}
                </Typography>
              </Box>
              {/* Search, reset button */}
              {state.isReady && <SearchTools isContentAvailable={isFinalContentAvailable} />}
              {/* Suggestions */}
              {state.isReady && <Suggestions />}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {(!state.isReady && !isPaused) || state.isFetching ? <CircularProgress size={40} /> : (
                <Fab onClick={handlePauseToggle} size='medium' color={isPaused ? 'inherit' : 'primary'}>
                  <MicIcon color={isPaused ? 'disabled' : 'inherit'} />
                </Fab>
              )}
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </Stack>
  )
};