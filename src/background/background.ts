import ExtPay from 'extpay';

const EXTENSION_ID = 'deefiijlijfjapjglgpdadbadlgiheec';

export enum ChromeResponseMsg {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
};

export const ChromeStorageKey = {
  INIT: 'init'
};

export enum BackgroundActions {
  TESTING = 'TESTING'
};

type TestingAction = {
  action: BackgroundActions.TESTING;
};

type Actions = TestingAction;

// const extPay = ExtPay(EXTENSION_ID);
// extPay.startBackground();

chrome.runtime.onMessage.addListener((msg: Actions, _, sendResponse) => {
  const { action } = msg;
  console.log(msg)

  if (action === BackgroundActions.TESTING) {
    console.log('background if:');
    // extPay.openPaymentPage();
    // (async() => {
      const extPay = ExtPay(EXTENSION_ID);
      // await extPay.openPaymentPage();
    // })();
  }
});

export {};
