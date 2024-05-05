import type { Preview } from '@storybook/react';
import '@lensshare/ui/tailwind.config.js'; // replace with the name of your tailwind css file
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
