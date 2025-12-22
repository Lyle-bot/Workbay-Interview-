// src/csv/importable-entities.ts
import { JobZone } from '../jobs/entities/job.entity';
import { Occupation } from '../occupation/entities/occupation.entity';

// Define entity config with class and expected CSV headers
// headers is a key[value] pair the key is the acutal field name in your entity
// the value is what is expected when user uploads file
// also when downloading file it's the headers the user will see.
export const IMPORTABLE_ENTITIES = {
  //This is What the user will see on user interface you can call it whatever
  JobZone: {
    entity: JobZone, // this is the acutal entity this is strict
    headers: {
      onetSocCode: 'O*NET-SOC Code', //values on the right side are the mapping labels(what the csv headers are)
      title: 'Title',
      jobZone: 'Job Zone',
      date: 'Date',
      domainSource: 'Domain Source',
    },
  },
  Occupation: {
    entity: Occupation,
    headers: {
      onetSocCode: 'O*NET-SOC Code',
      title: 'Title',
      description: 'Description',
    },
  },
} as const;

// Below Code doesn't change

export type ImportableEntityName = keyof typeof IMPORTABLE_ENTITIES;

// Helper functions
export function getEntity(name: ImportableEntityName) {
  return IMPORTABLE_ENTITIES[name].entity;
}

export function getExpectedHeaders(name: ImportableEntityName): string[] {
  return Object.values(IMPORTABLE_ENTITIES[name].headers);
}

export function getHeaderToFieldMap(
  name: ImportableEntityName,
): Record<string, string> {
  const { headers } = IMPORTABLE_ENTITIES[name];
  const map: Record<string, string> = {};

  for (const [field, header] of Object.entries(headers)) {
    map[header] = field;
  }

  return map;
}
