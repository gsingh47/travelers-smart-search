import React from 'react';
import { SuggestionsHeader } from './SuggestionsHeader';
import { Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { Chrome_Cache_Key, RecentSearchesType } from '../../types/common';

export type Props = {
  isContentAvailable: boolean
};

export const Suggestions: React.FC<Props> = ({ isContentAvailable }) => {
  const showSuggestion = !isContentAvailable;
  const [recentSearches, setRecentSearches] = React.useState<RecentSearchesType[]>();

  React.useEffect(() => {
    (async () => {
      const resp = await chrome.storage.local.get(Chrome_Cache_Key.RECENT_SEARCHES);
      
      if (resp && resp.recentSearches) {
        setRecentSearches(resp.recentSearches);
      }
    })();
  }, [chrome.storage.local.onChanged]);

  const handleClick = (index: number) => {
    const recentSearch = recentSearches[index];
    console.log(recentSearch);
  };

  return (
    <>
      <SuggestionsHeader isContentAvailable={isContentAvailable} isRecentSearchAvail={!!recentSearches?.length} />
      {recentSearches?.map((recentSearch, index) => (
        <Chip 
          key={`recent-search-${index}`}
          label={recentSearch.title}
          icon={<HistoryToggleOffIcon color='inherit' />}
          onClick={() => handleClick(index)}
          sx={{
            height: 'auto',
            p: 1,
            m: 1
          }}
        />
      ))}
      {showSuggestion && !recentSearches?.length &&
        <Chip 
          label="Search flights from seattle to LA on december 21st for 2 adults and 1 child, with return date January 13." 
          size="small" 
          icon={<SearchIcon color='inherit' />}
          sx={{
            height: 'auto',
            '& .MuiChip-label': {
              display: 'block',
              whiteSpace: 'normal',
            },
            p: 1,
            m: 1
          }}
        />
      }
    </>
  );
};