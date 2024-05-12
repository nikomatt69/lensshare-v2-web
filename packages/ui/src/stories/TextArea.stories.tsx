// stories/TextArea.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import { TextArea } from '../TextArea';
import { ComponentProps } from 'react';

export default {
  title: 'Components/TextArea',
  component: TextArea,
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Your Message',
    },
    placeholder: {
      control: 'text',
      defaultValue: 'Type your message here...',
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
    name: {
      control: 'text',
      defaultValue: 'message',
    },
    onChange: { action: 'onChange' },
    onFocus: { action: 'onFocus' },
    onBlur: { action: 'onBlur' }
  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<ComponentProps<typeof TextArea>> = (args) => <TextArea {...args} />;


export const Default: StoryFn<typeof TextArea> = (args) => <TextArea {...args} />;

Default.args = {};
export const WithLabel: StoryFn<typeof TextArea> = (args) => <TextArea {...args} />;

WithLabel.args = {
  label: 'Your Message',
  placeholder: 'Type something...'
};
export const Disabled: StoryFn<typeof TextArea> = (args) => <TextArea {...args} />;

Disabled.args = {
  label: 'Disabled Text Area',
  placeholder: 'This text area is disabled',
  disabled: true
};