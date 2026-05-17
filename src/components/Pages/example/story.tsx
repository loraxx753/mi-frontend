import type { Meta, StoryObj } from '@storybook/react';
import { LabPage } from '.';

const meta: Meta<typeof LabPage> = {
  component: LabPage,
  title: "Components/Pages"
};

export default meta;
type Story = StoryObj<typeof LabPage>;

export const Default: Story = {};
