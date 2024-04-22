import type { AnyPublication } from '@lensshare/lens';

export type Typename<T = string> = { [key in '__typename']?: T };

export type PickByTypename<
  T extends Typename,
  P extends T['__typename'] | undefined
> = T extends {
  __typename?: P;
}
  ? T
  : never;

export function isMirrorPublication<T extends AnyPublication>(
  publication: T | null
): publication is PickByTypename<T, 'Mirror'> {
  return publication?.__typename === 'Mirror';
}

export function isCommentPublication<T extends AnyPublication>(
  publication: T
): publication is PickByTypename<T, 'Comment'> {
  return publication.__typename === 'Comment';
}
