// stories/Card.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import { Card } from '../Card';
import React from 'react';
import { fn } from '@storybook/test';
export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    as: {
      control: { type: 'select', options: ['div', 'section', 'article'] },
      defaultValue: 'div',
    },
    className: {
      control: 'text',
      defaultValue:  'rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-900/90 ',
    },
    forceRounded: {
      control: 'boolean',
      defaultValue: false,
    },
    onClick: { action: 'card clicked' }
  },
  args: { onClick: fn() },
  tags: ['autodocs'],
} as Meta;

export const Template: StoryFn<typeof Card> = (args) => (
  <Card {...args}>
    <div className="p-4">
      This is a card. You can click it, customize it, and fill it with your content!
    </div>
  </Card>
);

export const Default: StoryFn<typeof Card> = (args) => <Card {...args} />;
Default.args = {
  children: 'Default Card',
  forceRounded: true,
  className: 'shadow-lg',
  
};
export const WithCustomElement: StoryFn<typeof Card> = (args) => <Card {...args} />;

WithCustomElement.args = {
  ...Default.args,
  as: 'section',
  children: 'This card is a section element.',
};
export const Rounded: StoryFn<typeof Card> = (args) => <Card {...args} />;

Rounded.args = {
  ...Default.args,
  forceRounded: true,
  className: 'shadow-lg',
  children: 'This card has forced rounded corners and a shadow.',
};
