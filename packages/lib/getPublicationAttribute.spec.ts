import { type MetadataAttribute, MetadataAttributeType } from '@lensshare/lens';
import { describe, expect, test } from 'vitest';

import getPublicationAttribute from './getPublicationAttribute';

describe('getPublicationAttribute', () => {
  const attributes: MetadataAttribute[] = [
    { key: 'type', value: 'book', type: MetadataAttributeType.String },
    { key: 'author', value: 'John Doe', type: MetadataAttributeType.String },
    { key: 'year', value: '2021', type: MetadataAttributeType.String }
  ];

  test('should return empty string if attributes is undefined', () => {
    expect(getPublicationAttribute(undefined, 'type')).toBe('');
  });

  test('should return empty string if key is not found in attributes', () => {
    expect(getPublicationAttribute(attributes, 'title')).toBe('');
  });

  test('should return the value of the matching key', () => {
    expect(getPublicationAttribute(attributes, 'author')).toBe('John Doe');
    expect(getPublicationAttribute(attributes, 'year')).toBe('2021');
  });

  test('should return the first matching key if there are multiple matches', () => {
    const updatedAttributes = [
      ...attributes,
      { key: 'author', value: 'Jane Smith', type: MetadataAttributeType.String }
    ];
    expect(getPublicationAttribute(updatedAttributes, 'author')).toBe(
      'John Doe'
    );
  });
});
