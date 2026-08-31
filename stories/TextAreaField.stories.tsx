import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextAreaField } from '../components/TextAreaField';

const meta = {
  title: 'MVP Creator/TextAreaField',
  component: TextAreaField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A labelled textarea used throughout MVP Creator for free-text fields — hypothesis, advantage, principles, etc.',
      },
    },
  },
  argTypes: {
    rows: { control: { type: 'number', min: 1, max: 20 } },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof TextAreaField>) => {
  const [value, setValue] = useState(args.value ?? '');
  return <TextAreaField {...args} value={value} onChange={setValue} />;
};

export const Empty: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'The Problem',
    value: '',
    placeholder: "What pain are your customers experiencing?",
  },
};

export const WithHelperText: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'The Customer',
    value: '',
    helperText: 'Be specific — "someone" is not a customer.',
    placeholder: 'Mid-sized law firms with 10–50 partners...',
  },
};

export const Prefilled: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'Foundation Hypothesis',
    value: "Paralegals spend 40% of billable hours categorising PDFs. A local-only LLM agent cuts that by 50% without touching the cloud.",
    helperText: 'One clear, falsifiable statement.',
    placeholder: '',
    rows: 4,
  },
};

export const Tall: Story = {
  render: args => <Controlled {...args} />,
  args: {
    label: 'Full Bio',
    value: '',
    placeholder: 'Write a detailed persona bio...',
    rows: 8,
  },
};
