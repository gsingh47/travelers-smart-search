import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import { VoiceSearchContextProvider } from '../provider/VoiceSearchProvider';

const init = () => {
  const container = document.createElement('div');
  if (!container) {
    throw new Error('Cannot find app container');
  }

  document.body.prepend(container);
  const root = createRoot(container);
  
  root.render(
    <VoiceSearchContextProvider>
      <App />
    </VoiceSearchContextProvider>
  );
};

init();