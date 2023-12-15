import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import type { Profile, ProfileSearchRequest } from '@lensshare/lens';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery
} from '@lensshare/lens';
import getAvatar from '@lensshare/lib/getAvatar';
import getProfile from '@lensshare/lib/getProfile';
import hasMisused from '@lensshare/lib/hasMisused';
import cn from '@lensshare/ui/cn';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import isVerified from '@lib/isVerified';
import type { TextNode } from 'lexical';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useUpdateEffect } from 'usehooks-ts';

import { $createMentionNode } from '../Nodes/MentionsNode';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;
const TRIGGERS = ['@'].join('');
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';
const VALID_JOINS = '(?:' + '\\.[ |$]|' + ' |' + '[' + PUNC + ']|' + ')';
const LENGTH_LIMIT = 32;
const ALIAS_LENGTH_LIMIT = 50;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$'
);

const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$'
);

const checkForAtSignMentions = (
  text: string,
  minMatchLength: number
): MenuTextMatch | null => {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }

  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2]
      };
    }
  }

  return null;
};

const getPossibleQueryMatch = (text: string): MenuTextMatch | null => {
  const match = checkForAtSignMentions(text, 1);
  return match;
};

class MentionTypeaheadOption extends MenuOption {
  id: string;
  name: string;
  handle: string;
  displayHandle: string;
  picture: string;

  constructor(
    id: string,
    name: string,
    handle: string,
    displayHandle: string,
    picture: string
  ) {
    super(name);
    this.id = id;
    this.name = name;
    this.handle = handle;
    this.displayHandle = displayHandle;
    this.picture = picture;
  }
}

interface MentionsTypeaheadMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}

const MentionsTypeaheadMenuItem: FC<MentionsTypeaheadMenuItemProps> = ({
  isSelected,
  onClick,
  onMouseEnter,
  option
}) => {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className="cursor-pointer"
      ref={option.setRefElement}
      role="option"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      aria-selected={isSelected}
      aria-hidden="true"
    >
      <div
        className={cn(
          { 'bg-gray-200 dark:bg-gray-800': isSelected },
          'm-1.5 flex items-center space-x-2 rounded-xl px-3 py-1 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800'
        )}
      >
        <img
          className="h-7 w-7 rounded-full"
          height="32"
          width="32"
          src={option.picture}
          alt={option.handle}
        />
        <div className="flex flex-col truncate">
          <div className="flex items-center space-x-1 text-sm">
            <span>{option.name}</span>
            {isVerified(option.id) ? (
              <CheckBadgeIcon className="text-brand h-4 w-4" />
            ) : null}
            {hasMisused(option.id) ? (
              <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
          <span className="text-xs">{option.displayHandle}</span>
        </div>
      </div>
    </li>
  );
};

const MentionsPlugin: FC = () => {
  const [queryString, setQueryString] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>[]>([]);
  const [editor] = useLexicalComposerContext();
  const [searchUsers] = useSearchProfilesLazyQuery();

  useUpdateEffect(() => {
    if (queryString) {
      // Variables
      const request: ProfileSearchRequest = {
        where: { customFilters: [CustomFiltersType.Gardeners] },
        query: queryString,
        limit: LimitType.Ten
      };

      searchUsers({ variables: { request } }).then(({ data }) => {
        const search = data?.searchProfiles;
        const profileSearchResult = search;
        const profiles = (
          search && search.hasOwnProperty('items')
            ? profileSearchResult?.items
            : []
        ) as Profile[];
        const profilesResults = profiles.map(
          (user) =>
            ({
              id: user?.id,
              name: getProfile(user).displayName,
              handle: user.handle?.fullHandle,
              displayHandle: getProfile(user).slugWithPrefix,
              picture: getAvatar(user)
            }) as Record<string, string>
        );
        setResults(profilesResults);
      });
    }
  }, [queryString]);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const options = useMemo(
    () =>
      results
        .map(({ id, name, handle, displayHandle, picture }) => {
          return new MentionTypeaheadOption(
            id,
            name ?? handle,
            handle,
            displayHandle,
            picture
          );
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.handle);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select().insertText(' ');
        closeMenu();
      });
    },
    [editor]
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && mentionMatch ? mentionMatch : null;
    },
    [checkForSlashTriggerMatch, editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="bg-brand sticky z-40 mt-8 w-52 min-w-full rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <ul className="divide-y dark:divide-gray-700">
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
};

export default MentionsPlugin;
