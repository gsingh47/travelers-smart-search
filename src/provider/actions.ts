import { ConnectionClosedType } from "./reducer";

export enum ActionType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  RECORDER_STATE_CHANGE = 'RECORDER_STATUS_CHANGE',
  SEARCH = 'SEARCH',
  FETCHING = 'FETCHING',
  SET_DESTINATION_SUGGESTIONS = 'SHOW_DESTINATION_SUGGESTIONS',
};

export type OnSetDestinationSuggestionsAction = {
  type: ActionType.SET_DESTINATION_SUGGESTIONS;
  payload: any;
};

export type OnConnectedAction = {
  type: ActionType.CONNECTED;
  payload: boolean;
};

export type OnDisConnectedAction = {
  type: ActionType.DISCONNECTED;
  payload: ConnectionClosedType;
};

export type OnErrorAction = {
  type: ActionType.ERROR;
  payload?: unknown;
};

export type OnRecorderStateChangeAction = {
  type: ActionType.RECORDER_STATE_CHANGE;
  payload: string;
};

export type OnSearchAction = {
  type: ActionType.SEARCH;
  payload: {
    searchClicked: boolean;
    searchText?: string;
  };
};

export type OnFetchAction = {
  type: ActionType.FETCHING;
  payload: boolean;
};

export type Actions =  OnErrorAction | OnConnectedAction | OnDisConnectedAction | OnRecorderStateChangeAction |
  OnSearchAction | OnFetchAction | OnSetDestinationSuggestionsAction;