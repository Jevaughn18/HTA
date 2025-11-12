import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'belief',
  title: 'Beliefs',
  type: 'document',
  fields: [
    defineField({
      name: 'articleNumber',
      title: 'Article Number',
      type: 'number',
      validation: Rule => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Article Number',
      name: 'articleNumberAsc',
      by: [{ field: 'articleNumber', direction: 'asc' }],
    },
  ],
})
