import { z } from 'zod';

// Example schema to demonstrate validation patterns without domain specifics.
export const exampleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title must be under 120 characters'),
});

export type ExampleData = z.infer<typeof exampleSchema>;

export const validateExample = (data: unknown) => exampleSchema.safeParse(data);

export const defaultExampleValues: Partial<ExampleData> = {
  title: '',
};
``