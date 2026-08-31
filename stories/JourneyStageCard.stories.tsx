import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JourneyStageCard, Stage } from '../components/JourneyStageCard';

const meta = {
  title: 'MVP Creator/JourneyStageCard',
  component: JourneyStageCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A single stage in the Journey Map. Each stage tracks the user\'s steps, pain points, and opportunities — plus their emotional state at that point in the journey.',
      },
    },
  },
  argTypes: {
    index: { control: { type: 'number', min: 0 } },
    total: { control: { type: 'number', min: 1 } },
  },
} satisfies Meta<typeof JourneyStageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const EMPTY_STAGE: Stage = {
  id: 'stage-1',
  name: 'Awareness',
  steps: [],
  emotion: 'curious',
  painPoints: [],
  opportunities: [],
};

const FILLED_STAGE: Stage = {
  id: 'stage-2',
  name: 'Consideration',
  steps: ['Googles "AI for law firms"', 'Reads 3 vendor comparison articles', 'Books a demo'],
  emotion: 'hopeful',
  painPoints: ['Every vendor requires cloud upload', 'No pricing transparency'],
  opportunities: ['Position "air-gapped" as a feature, not a limitation'],
};

const Controlled = (args: React.ComponentProps<typeof JourneyStageCard>) => {
  const [stage, setStage] = useState<Stage>(args.stage);
  return (
    <JourneyStageCard
      {...args}
      stage={stage}
      onChange={setStage}
    />
  );
};

export const EmptyStage: Story = {
  render: args => <Controlled {...args} />,
  args: {
    stage: EMPTY_STAGE,
    index: 0,
    total: 3,
    onRemove: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
  },
};

export const FilledStage: Story = {
  render: args => <Controlled {...args} />,
  args: {
    stage: FILLED_STAGE,
    index: 1,
    total: 4,
    onRemove: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
  },
};

export const FirstStage: Story = {
  name: 'First Stage (↑ disabled)',
  render: args => <Controlled {...args} />,
  args: {
    stage: { ...FILLED_STAGE, name: 'Discovery', emotion: 'frustrated' },
    index: 0,
    total: 4,
    onRemove: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
  },
};

export const LastStage: Story = {
  name: 'Last Stage (↓ disabled)',
  render: args => <Controlled {...args} />,
  args: {
    stage: { ...FILLED_STAGE, name: 'Advocacy', emotion: 'excited' },
    index: 3,
    total: 4,
    onRemove: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
  },
};

export const AllEmotions: Story = {
  render: () => {
    const emotions = ['frustrated', 'curious', 'neutral', 'hopeful', 'happy', 'excited', 'disappointed'];
    return (
      <div>
        {emotions.map((emotion, i) => {
          const [stage, setStage] = useState<Stage>({ id: emotion, name: emotion.charAt(0).toUpperCase() + emotion.slice(1), steps: [], emotion, painPoints: [], opportunities: [] });
          return (
            <JourneyStageCard
              key={emotion}
              stage={stage}
              index={i}
              total={emotions.length}
              onChange={setStage}
              onRemove={() => {}}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
            />
          );
        })}
      </div>
    );
  },
};
