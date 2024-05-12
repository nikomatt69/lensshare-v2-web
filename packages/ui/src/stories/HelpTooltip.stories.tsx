// stories/HelpTooltip.stories.tsx
import { Meta,  StoryFn } from '@storybook/react';
import Tippy from '@tippyjs/react';
import HelpTooltip from '../HelpTooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default {
  title: 'Components/Help Tooltip',
  component: HelpTooltip,
  subcomponents : {Tippy},
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'Helpful information here',
    },
   
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof HelpTooltip>> = (args) => <HelpTooltip {...args} >
  <Tippy
      placement="top"
      duration={0}
      className="!rounded-xl p-2.5 !leading-5 tracking-wide shadow-lg"
      content={''}
    >
      <span>
        <InformationCircleIcon className="lt-text-gray-500 h-[15px] w-[15px]" />
      </span>
    </Tippy>
  </HelpTooltip>;

export const Default: StoryFn<typeof HelpTooltip> = (args) => <HelpTooltip {...args} />;
Default.args = {
  children: 'Hover over the icon for more info',



};

