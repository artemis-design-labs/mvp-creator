import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PersonaPillList } from '../components/PersonaPillList';

const meta = {
  title: 'MVP Creator/Persona/PersonaPillList',
  component: PersonaPillList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A pill-tag list used in the Persona section for tools, personality traits, and short categorical attributes.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof PersonaPillList>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof PersonaPillList>) => {
  const [items, setItems] = useState<string[]>(args.items ?? []);
  return <PersonaPillList {...args} items={items} onChange={setItems} />;
};

export const Empty: Story = {
  render: args => <Controlled {...args} />,
  args: {
    placeholder: 'Add a tool...',
  },
};

export const Tools: Story = {
  render: args => <Controlled {...args} />,
  args: {
    items: ['Outlook', 'iManage', 'Relativity', 'Excel', 'Adobe Acrobat'],
    placeholder: 'Add a tool...',
  },
};

export const Personality: Story = {
  render: args => <Controlled {...args} />,
  args: {
    items: ['Risk-averse', 'Detail-oriented', 'Process-driven', 'Skeptical of AI', 'Budget-conscious'],
    placeholder: 'Add a trait...',
  },
};
