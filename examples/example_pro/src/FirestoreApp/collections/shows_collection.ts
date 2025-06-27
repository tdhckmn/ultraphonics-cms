import { buildCollection } from '@firecms/core';
import type { EntityCollection } from '@firecms/core';

export const showsCollection: EntityCollection = buildCollection({
  id: 'shows',
  path: 'shows',
  name: 'Shows',
  singularName: 'Show',
  group: 'Content',
  permissions: {
    edit: true,
    create: true,
    delete: true,
  },
  properties: {
    date: {
      name: 'Date',
      dataType: 'date',
      validation: { required: true },
    },
    venue: {
      name: 'Venue',
      dataType: 'string',
      validation: { required: true },
    },
    location: {
      name: 'Location',
      dataType: 'string',
    },
    notes: {
      name: 'Notes',
      dataType: 'string',
      markdown: true,
    },
    poster: {
      name: 'Poster',
      dataType: 'string',
      storage: {
        acceptedFiles: ['image/*'],
        storagePath: 'posters',
      },
    },
    isPrivate: {
      name: 'Private Show?',
      dataType: 'boolean',
      defaultValue: false,
    },
  },
});
