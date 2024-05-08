// stories/Input.stories.tsx
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Input } from '../Input';
import { Meta, StoryFn } from '@storybook/react';


export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Your Name',
    },
    prefix: {
      control: 'text',
    },
    iconLeft: {
      control: 'boolean',
      mapping: {
        true: <UserIcon className='w-3 h-3'/>,
        false: undefined,
      },
      defaultValue: false,
    },
    iconRight: {
      control: 'boolean',
      mapping: {
        true: <EnvelopeIcon className='w-3 h-3'/>,
        false: undefined,
      },
      defaultValue: false,
    },
    backgroundColor: {
      control: 'color',
      defaultValue: '#FFFFFF',
    },
    textColor: {
      control: 'color',
      defaultValue: '#333333',
    },
    placeholder: {
      control: 'text',
      defaultValue: 'Enter your name',
    },
    className: {
      control:'text',
      defaultValue:''
    }
   
  },
  
 
} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof Input>> = (args) => <Input {...args} />;

export const Default: StoryFn<typeof Input> = (args) => <Input {...args} />;
Default.args = {
  label: 'Your Name',
  placeholder: 'Enter your name',
};


export const WithPrefixAndIcons: StoryFn<typeof Input> = (args) => <Input {...args} />;
WithPrefixAndIcons.args = {
  label: 'Email Address',
  prefix: '@',
  iconRight: true,
  placeholder: 'example@domain.com',
};

export const DifferentPlacement: StoryFn<typeof Input> = (args) => <Input {...args} />;
DifferentPlacement.args = {
  ...Default.args,
  className:'text-blue'
  

};