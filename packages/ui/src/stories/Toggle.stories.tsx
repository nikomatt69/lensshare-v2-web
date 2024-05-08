// stories/Toggle.stories.tsx
import { Toggle } from '../Toggle';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Toggle Switch',
  component: Toggle,
  argTypes: {
    initial: {
      control: 'boolean',
      defaultValue: false,
    },
    onColor: {
      control: 'color',
      defaultValue: '#4CAF50',
    },
    offColor: {
      control: 'color',
      defaultValue: '#f44336',
    },
    padding: {
      control: 'text',
      defaultValue: '10px',
    },
    setOn:{
      control: 'boolean',
      defaultValue: false
    },

  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof Toggle>> = (args) => <Toggle {...args} />;

export const Default: StoryFn<typeof Toggle> = (args) => <Toggle {...args} />;

Default.args = {};
export const WithLabel: StoryFn<typeof Toggle> = (args) => <Toggle{...args} />;

WithLabel.args = {
  on:false,
  setOn(on) {
    false
  },
  
 
};
export const Disabled: StoryFn<typeof Toggle> = (args) => <Toggle {...args} />;

Disabled.args = {

  on:true,
  setOn(on) {
    true
  },
};