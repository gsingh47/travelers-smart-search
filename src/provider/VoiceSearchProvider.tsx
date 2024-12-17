import React, { Dispatch, PropsWithChildren } from 'react';
import { Actions } from './actions';
import { initialState, reducer, State } from './reducer';

type Context = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const VoiceSearchContext = React.createContext<Context>({
  state: initialState,
  dispatch: () => undefined
});

export const VoiceSearchContextProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const [context, setContext] = React.useReducer(reducer, initialState);

  return <VoiceSearchContext.Provider value={{ state: context, dispatch: setContext }}>{children}</VoiceSearchContext.Provider>;
};

export const useVoiceSearchContext = () => {
  return React.useContext(VoiceSearchContext);
};

