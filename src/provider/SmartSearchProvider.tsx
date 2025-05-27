import React, { Dispatch, PropsWithChildren } from 'react';
import { Actions } from './actions';
import { initialState, reducer, State } from './reducer';

type Context = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const SmartSearchContext = React.createContext<Context>({
  state: initialState,
  dispatch: () => undefined
});

export const SmartSearchContextProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const [context, setContext] = React.useReducer(reducer, initialState);

  return <SmartSearchContext.Provider value={{ state: context, dispatch: setContext }}>{children}</SmartSearchContext.Provider>;
};

export const useSmartSearchContext = () => {
  return React.useContext(SmartSearchContext);
};

