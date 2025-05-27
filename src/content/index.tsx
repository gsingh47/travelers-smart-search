import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import { SmartSearchContextProvider } from '../provider/SmartSearchProvider';

const init = () => {
  const container = document.createElement('div');
  if (!container) {
    throw new Error('Cannot find app container');
  }

  document.body.prepend(container);
  const root = createRoot(container);
  
  root.render(
    <SmartSearchContextProvider>
      <App />
    </SmartSearchContextProvider>
  );
};

init();