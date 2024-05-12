// stories/Select.stories.tsx
import { Select } from '../Select';
import { Meta,  StoryFn } from '@storybook/react';

export default {
  title: 'Components/Select Dropdown',
  component: Select,
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Choose Option',
    },
    options: {
      control: 'object',
      defaultValue: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
    },
    backgroundColor: {
      control: 'color',
      defaultValue: '#ffffff',
    },
    textColor: {
      control: 'color',
      defaultValue: '#333333',
    },
    fontSize: {
      control: 'text',
      defaultValue: '16px',
    },
    className:{
      control:'text',
      defaultValue:'rounded-xl'
    }
  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof Select>> = (args) => <Select {...args} />;
export const Default: StoryFn<typeof Select> = (args) => <Select {...args} />;
Default.args = {
  label: 'Choose Option',
  options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
};
export const CustomStyle: StoryFn<typeof Select> = (args) => <Select {...args} />;
CustomStyle.args = {
  label: 'Custom Style Dropdown',
  options: [{ label: 'First Choice', value: 'first' }, { label: 'Second Choice', value: 'second' }],
  className:'rounded-xl'


 
};