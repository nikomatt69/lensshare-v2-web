import { Meta, StoryFn } from '@storybook/react';
import { Spinner } from '../Spinner';
import React from 'react';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
      defaultValue: 'primary',
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg'] },
      defaultValue: 'md',
    },
    className: {
      control: 'text',
      defaultValue:''
    }
  },
  tags: ['autodocs'],

} as Meta;
export const Template: StoryFn<React.ComponentProps<typeof Spinner>> = (args) => <Spinner {...args} />;

export const Default: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;
Default.args = {};

export const Primary: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;
Primary.args = {
  variant: 'primary',
  size: 'md'
};

export const LargeDanger: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;
LargeDanger.args = {
  variant: 'danger',
  size: 'lg'
};
