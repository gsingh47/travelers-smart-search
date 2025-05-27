import { TranscriptComponentState } from "../components/VoiceSearchWrapper";
import { SearchType, Site } from "../constants/constants";

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

export const getSearchCriteria = async (searchText: string) => {
  try {
    const response = await fetch('http://localhost:4000/getSearchCriteria', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({searchText, site: Site.BOOKING, searchType: SearchType.HOTELS})
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
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