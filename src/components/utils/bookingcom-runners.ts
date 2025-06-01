const DESTINATION_INPUT_SELECTOR = '.b915b8dc0b';
const DESTINATION_AUTO_COMPLETE_PARENT_SELECTOR = '.e03644d405';
const DESTINATION_AUTO_COMPLETE_SELECTOR = '.e521bfa3f4';
const DESTINATION_TRENDING_HEADER_SELECTOR = '.d72f1441bc';
const SEARCH_BUTTON_SELECTOR = '.a7e79c28d6 button';

const waitForElement = (selector: string) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    }, 100);
  });
}

export const waitForElementToDisappear = (selector: string, timeout: number = 2000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (!element) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 50);
  });
}

export const runDestinationSearch = async (searchText: string) => {
  const destinationInput = document.querySelector(DESTINATION_INPUT_SELECTOR) as HTMLInputElement;
  destinationInput.focus();
  destinationInput.value = searchText;
  destinationInput.dispatchEvent(new Event('input', { bubbles: true }));
}

export const runSearch = async (searchText: string, selectedDestIndex: number = 0) => {
  runDestinationSearch(searchText);

  const optionsParent = await waitForElement(DESTINATION_AUTO_COMPLETE_PARENT_SELECTOR) as HTMLElement;
  const trendingHeaderDissapeared = await waitForElementToDisappear(DESTINATION_TRENDING_HEADER_SELECTOR);

  if (optionsParent && trendingHeaderDissapeared) {
    const autoCompleteOptions = optionsParent.querySelectorAll(DESTINATION_AUTO_COMPLETE_SELECTOR) as NodeListOf<HTMLDivElement>;

    if (autoCompleteOptions && autoCompleteOptions.length > 0) {
      const selectedDestOption = autoCompleteOptions[selectedDestIndex];
      selectedDestOption.click();

      const destinationInput = await waitForElement(DESTINATION_INPUT_SELECTOR) as HTMLInputElement;
      const isAutoCompleteClosed = destinationInput.getAttribute('aria-expanded');

      if (isAutoCompleteClosed === 'false') {
        const submitButton = document.querySelector(SEARCH_BUTTON_SELECTOR) as HTMLButtonElement;
        submitButton.click();
      }
    }
  }
}

