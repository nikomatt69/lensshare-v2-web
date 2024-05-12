// stories/Image.stories.tsx
import { Image } from '../Image';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/Image',
  component: Image,
  argTypes: {
    src: {
      control: 'text',
      defaultValue: 'path/to/image.jpg',
    },
    alt: {
      control: 'text',
      defaultValue: 'Description of the image',
    },
   className:{
    control:'text',
    defaultValue:'h-10 w-10 rounded-xl'
   }
  },
  tags: ['autodocs'],

} as Meta;

export const Template: StoryFn<React.ComponentProps<typeof Image>> = (args) => <Image {...args} />;

export const Default: StoryFn<typeof Image> = (args) => <Image {...args} />;
Default.args = {
  src: 'path/to/image.jpg',
  alt: 'Description of the image',
  className: 'h-10 w-10 rounded-xl'

};

export const CustomIconSize: StoryFn<typeof Image> = (args) => <Image {...args} />;
CustomIconSize.args = {
  ...Default.args,
  className: 'h-10 w-10 rounded-xl border-2 border-blue'

};

export const DifferentPlacement: StoryFn<typeof Image> = (args) => <Image {...args} />;
DifferentPlacement.args = {
  ...Default.args,

};