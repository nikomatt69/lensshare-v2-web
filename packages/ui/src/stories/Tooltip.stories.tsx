// stories/Tooltip.stories.tsx
import { Tooltip } from '../Tooltip';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    content: {
      control: 'text',
      defaultValue: 'More info here',
    },
    backgroundColor: {
      control: 'color',
      defaultValue: '#f3f3f3',
    },
    borderColor: {
      control: 'color',
      defaultValue: '#ccc',
    },
    padding: {
      control: 'text',
      defaultValue: '10px',
    },
  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof Tooltip>> = (args) => (
    <Tooltip {...args}>
        <button>Hover over me</button>
    </Tooltip>
);

