import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PersonaBulletList } from '../components/PersonaBulletList';

const meta = {
  title: 'MVP Creator/Persona/PersonaBulletList',
  component: PersonaBulletList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A bullet list used in the Persona section for goals, frustrations, motivations, and behaviors. Purple bullet accent matches the ADL brand.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof PersonaBulletList>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof PersonaBulletList>) => {
  const [items, setItems] = useState<string[]>(args.items ?? []);
  return <PersonaBulletList {...args} items={items} onChange={setItems} />;
};

export const Empty: Story = {
  render: args => <Controlled {...args} />,
  args: {
    placeholder: 'Add a goal...',
  },
};

export const Goals: Story = {
  render: args => <Controlled {...args} />,
  args: {
    items: [
      'Reduce discovery time by 50% without risking compliance',
      'Maintain full data sovereignty — no cloud uploads',
      'Cut paralegal overtime costs before year-end review',
    ],
    placeholder: 'Add a goal...',
  },
};

export const Frustrations: Story = {
  render: args => <Controlled {...args} />,
  args: {
    items: [
      'Every SaaS vendor wants to "own" firm data',
      'IT department blocks anything without a 6-month procurement process',
      'Junior associates spend billable hours on glorified filing',
    ],
    placeholder: 'Add a frustration...',
  },
};
