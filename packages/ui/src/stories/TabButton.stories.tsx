// stories/TabButton.stories.tsx
import  TabButton  from '../TabButton';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Tab Button',
  component: TabButton,
  argTypes: {
    isActive: {
      control: 'boolean',
      defaultValue: true,
    },
    label: {
      control: 'text',
      defaultValue: 'Tab 1',
    },
    activeColor: {
      control: 'color',
      defaultValue: '#4CAF50',
    },
    textColor: {
      control: 'color',
      defaultValue: 'white',
    },
  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof TabButton>> = (args) => <TabButton {...args} />;

