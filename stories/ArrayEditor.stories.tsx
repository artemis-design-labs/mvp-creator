import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrayEditor } from '../components/ArrayEditor';

const meta = {
  title: 'MVP Creator/ArrayEditor',
  component: ArrayEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An editable list of strings. Used for principles, milestones, blockers, sources, competitor features, and more. Type and press Enter or click Add.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof ArrayEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof ArrayEditor>) => {
  const [items, setItems] = useState<string[]>(args.items ?? []);
  return <ArrayEditor {...args} items={items} onChange={setItems} />;
};

export const Empty: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'Decision Principles',
    placeholder: 'Add a principle...',
  },
};

export const WithItems: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'Decision Principles',
    items: ['Boring > Exciting', 'Outcome > Output', 'No monthly fees'],
    placeholder: 'Add a principle...',
  },
};

export const WithHelperText: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'Blockers',
    items: ['Need legal sign-off on data handling'],
    helperText: 'Things that will stop progress if left unresolved.',
    placeholder: 'Add a blocker...',
  },
};

export const NoLabel: Story = {
  name: 'No Label (inline use)',
  render: args => <Controlled {...args} />,
  args: {
    items: ['Feature parity with Notion', 'Free tier available', 'Strong API'],
    placeholder: 'Add a feature...',
  },
};
