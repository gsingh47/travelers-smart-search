import { Chip, Divider } from '@mui/material';
import React from 'react';
import { Props } from './Suggestions';

const Msg = {
  EXAMPLE_SEARCH: 'Example Search',
  RECENT_SEARCH: 'Recent searches',
  HIT_SEARCH: 'Hit search when ready'
};

export const SuggestionsHeader: React.FC<Props & {isRecentSearchAvail?: boolean}> = ({ isContentAvailable, isRecentSearchAvail }) => {
  const [label, setLabel] = React.useState(Msg.EXAMPLE_SEARCH);

  React.useEffect(() => {
    if (isRecentSearchAvail) {
      setLabel(Msg.RECENT_SEARCH);
    } else if (isContentAvailable) {
      setLabel(Msg.HIT_SEARCH);
    } else {
      setLabel(Msg.EXAMPLE_SEARCH);
    }
  }, [isContentAvailable, isRecentSearchAvail]);

  return (
    <Divider>
      <Chip label={label} size="small" />
    </Divider>
  );
};