import { ExtPay } from 'extpay';

export enum ChromeResponseMsg {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
};

enum ChromeActions {
  TESTING = 'TESTING'
};

type TestingAction = {
  action: ChromeActions.TESTING;
};

type Actions = TestingAction;

chrome.runtime.onMessage.addListener((msg: Actions, _, sendResponse) => {
  const { action } = msg;

  if (action === ChromeActions.TESTING) {
    console.log('background inside if');
    sendResponse('success');
  }
});

export {};
