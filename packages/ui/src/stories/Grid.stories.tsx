// stories/Grid.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import { GridLayout, GridItemFour, GridItemEight } from '../GridLayout';
import React from 'react';

export default {
  title: 'Components/Grid',
  component: GridLayout,
  subcomponents: { GridItemFour, GridItemEight },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      defaultValue: '',
    },
    classNameChild: {
      control: 'text',
      defaultValue: '',
    },
  },

} as Meta;

export const Template: StoryFn<typeof GridLayout> = (args) => (
  <GridLayout {...args}>
    <GridItemFour className="bg-blue-500 text-white p-3">
      <div>This is a 4/12 column grid item.</div>
    </GridItemFour>
    <GridItemEight className="bg-green-500 text-white p-3">
      <div>This is an 8/12 column grid item.</div>
    </GridItemEight>
  </GridLayout>
);

export const Default: StoryFn<typeof GridLayout> = (args) => <GridLayout {...args} />;
Default.args = {
  classNameChild: 'gap-4 border rounded-xl',
  className: 'borer-2'
};

export const CustomSpacing: StoryFn<typeof GridLayout> = (args) => <GridLayout {...args} />;
CustomSpacing.args = {
  classNameChild: 'gap-10 border',
  className: 'borer-2'
};
