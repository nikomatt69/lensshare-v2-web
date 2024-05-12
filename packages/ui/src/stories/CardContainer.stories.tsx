// stories/CardContainer.stories.tsx
import { Meta, StoryFn } from '@storybook/react';
import { CardContainer, CardBody, CardItem, useMouseEnter } from '../3DCard';
import React from 'react';

export default {
  title: 'Components/CardContainer',
  component: CardContainer,
  subcomponents: { CardBody, CardItem },
  tags: ['autodocs'],
  argTypes: {
    translateX: {
      control: 'number',
      defaultValue: 0,
    },
    translateY: {
      control: 'number',
      defaultValue: 0,
    },
    translateZ: {
      control: 'number',
      defaultValue: 0,
    },
    rotateX: {
      control: 'number',
      defaultValue: 0,
    },
    rotateY: {
      control: 'number',
      defaultValue: 0,
    },
    rotateZ: {
      control: 'number',
      defaultValue: 0,
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CardContainer>;

const Template: StoryFn<React.ComponentProps<typeof CardContainer> & {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}> = ({ translateX, translateY, translateZ, rotateX, rotateY, rotateZ, ...args }) => (
  <CardContainer {...args}>
    <CardBody className="'relative border items-center justify-center transition-all duration-200 ease-linear'">
      <CardItem
        translateX={translateX}
        translateY={translateY}
        translateZ={translateZ}
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={rotateZ}
        className="text-center border"
      >
        Interactive 3D Card
      </CardItem>
    </CardBody>
  </CardContainer>
);

export const Default = Template.bind({});
Default.args = {
  className: 'relative items-center justify-center transition-all duration-200 ease-linear',
  containerClassName: 'max-w-sm',
  children: 'Hover to see the 3D effect!',
  translateX: 30,
  translateY: 15,
  translateZ: 50,
  rotateX: 30,
  rotateY: 15,
  rotateZ: 7,
};

export const Interactive3D = Template.bind({});
Interactive3D.args = {
  ...Default.args,
  translateX: 10,
  translateY: 10,
  translateZ: 50,
  rotateX: 20,
  rotateY: 20,
  rotateZ: 5,
};