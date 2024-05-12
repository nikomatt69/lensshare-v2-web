// stories/Button.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import { Button } from '../Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { fn } from '@storybook/test';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      defaultValue: 'md',
    },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'warning', 'black', 'danger'] },
      defaultValue: 'primary',
    },
    outline: {
      control: 'boolean',
      defaultValue: false,
    },
    icon: {
      control: 'boolean',
      mapping: {
        true: <CheckCircleIcon className='h-3 w-3' />,
        false: null
      },
      defaultValue: false,
    },
    children: {
      control: 'text',
      defaultValue: 'Click me',
    },
    onClick: { action: 'clicked' }
  },
  args: { onClick: fn() },
  
  tags: ['autodocs'],
} as Meta;

export const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;


export const Default: StoryFn<typeof Button> = (args) => <Button {...args} />;

Default.args = {
  variant : 'primary',
  children: 'Click Me',
  outline: true,
  size: 'md'

};

export const WithIcon: StoryFn<typeof Button> = (args) => <Button {...args} />;


WithIcon.args = {
  ...Default.args,
  icon: true,
  children: 'Confirm',
};
export const LargePrimary: StoryFn<typeof Button> = (args) => <Button {...args} />;


LargePrimary.args = {
  ...Default.args,
  size: 'lg',
  variant: 'primary',
};

export const OutlineDanger: StoryFn<typeof Button> = (args) => <Button {...args} />;

OutlineDanger.args = {
  ...Default.args,
  outline: true,
  variant: 'danger',
};

export const Black: StoryFn<typeof Button> = (args) => <Button {...args} />;

Black.args = {
  ...Default.args,
  outline: true,
  variant: 'black',
};
