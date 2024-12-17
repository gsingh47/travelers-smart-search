import { TranscriptComponentState } from "../components/VoiceSearchWrapper";

export const getDisplayText = (transcriptState: TranscriptComponentState): string | undefined => {
  const { transcript, finalTranscript } = transcriptState;
  if (!finalTranscript) return transcript;
  
  if (transcript) {
    return finalTranscript.concat(' ', transcript);
  }
  return finalTranscript;
};

export const getCardTitleText = (isPaused: boolean, error: any): {title: string, titleColor: string} => {
  const titleColor = error ? 'error' : 'info';
  const title = isPaused && !error ? 'Paused' : error;
  return {title, titleColor};
};

const waitForElement = (selector: string) => {
  return new Promise((resolve) => {
      const observer = new MutationObserver((_, observer) => {
          const element = document.querySelector(selector);
          if (element) {
              observer.disconnect();
              resolve(element);
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
};

// const element = document.body.querySelector('[data-stid="origin_select-menu-trigger"]');
//     const clickEvent = new MouseEvent('click', {
//       bubbles: true,
//       cancelable: true
//     });
//     element.dispatchEvent(clickEvent);