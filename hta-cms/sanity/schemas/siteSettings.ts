import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'string',
    }),
    defineField({
      name: 'visionStatement',
      title: 'Vision Statement',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'history',
      title: 'Church History',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'nameExplanation',
      title: 'Name Explanation',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'sundayServiceTime',
      title: 'Sunday Service Time',
      type: 'string',
    }),
    defineField({
      name: 'sundaySchoolTime',
      title: 'Sunday School Time',
      type: 'string',
    }),
    defineField({
      name: 'bankName',
      title: 'Bank Name',
      type: 'string',
    }),
    defineField({
      name: 'accountNumber',
      title: 'Account Number',
      type: 'string',
    }),
    defineField({
      name: 'branchName',
      title: 'Branch Name',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
  ],
})
