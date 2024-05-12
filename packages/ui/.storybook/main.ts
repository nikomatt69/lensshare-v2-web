import type { StorybookConfig } from '@storybook/nextjs';

import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',"../src/**/*.mdx", ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    '@storybook/addon-a11y',
    '@storybook/addon-styling-webpack',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-docs',
    
    {
      name: "@chromatic-com/storybook",
      options: {
        //👇 Loads the configuration file based on the current environment
        configFile:
          process.env.NODE_ENV === "development"
            ? "chromatic.config.json"
            : "production.config.json",
      },
    },
   '@storybook/addon-interactions',
   {
    name: '@storybook/addon-styling-webpack',
    options: {
      rules: [
        {
          test: /\.css$/,
          sideEffects: true,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                implementation: require.resolve('postcss'),
              },
            },
          ],
        },
      ],
    },
  },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      
    },
  },
  docs: {
    autodocs: 'tag'
  }
};
export default config;
