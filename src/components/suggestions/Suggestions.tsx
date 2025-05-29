import React from 'react';
import { Chip, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { Chrome_Cache_Key, RecentSearchesType } from '../../types/common';
import { useSmartSearchContext } from '../../provider/SmartSearchProvider';

type ComponentProps = {
  onSelect?: (index: number) => void;
};

export const Suggestions: React.FC<ComponentProps> = ({ onSelect }) => {
  // const [recentSearches] = React.useState<RecentSearchesType[]>();
  const { state } = useSmartSearchContext();
  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(undefined);

  // React.useEffect(() => {
  //   (async () => {
  //     const resp = await chrome.storage.local.get(Chrome_Cache_Key.RECENT_SEARCHES);
      
  //     if (resp && resp.recentSearches) {
  //       setRecentSearches(resp.recentSearches);
  //     }
  //   })();
  // }, [chrome.storage.local.onChanged]);

  const handleClick = (_: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
    onSelect?.(index);
  }

  const listIcon = (destType: string) => {
    switch (destType) {
      case 'city':
      case 'district':
      case 'region':
        return <PlaceIcon color='inherit' />;
      case 'airport':
        return <FlightTakeoffIcon color='inherit' />;
      case 'landmark':
        return <AccountBalanceIcon color='inherit' />;
      default:
        return <PlaceIcon color='inherit' />;
    }
  }

  const destinationSuggestions = state.destinationSuggestions.map((suggestion, index) => (
    <ListItemButton 
      key={`destination-suggestion-item-${index}`}
      selected={selectedIndex === index}
      onClick={(event) => handleClick(event, index)}
    >
      <ListItemIcon>{listIcon(suggestion.destType)}</ListItemIcon>
      <ListItemText primary={suggestion.primary.replaceAll(/&amp;/g, '&')} secondary={suggestion.secondary} />
    </ListItemButton>
  ))

  return (
    <>
      { 
        <List component="nav" sx={{ width: '100%', maxHeight: '280px', overflowY: 'auto' }}>
          {destinationSuggestions}
        </List>
      }
      {/* {recentSearches?.map((recentSearch, index) => (
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
      ))} */}
      {/* {showSuggestion && !recentSearches?.length &&
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
      } */}
    </>
  );
};