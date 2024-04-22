
import { Menu } from '@headlessui/react';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import SearchProfile from './SeachProfile';


import type { Dispatch, FC, SetStateAction } from 'react';
import React from 'react';
import { TokenGateCondition } from 'src/enums';
import { Input, Toggle } from '@lensshare/ui';
import MenuTransition from '@components/Shared/MenuTransition';
import { useSpacesStore } from 'src/store/persisted/spaces';
import cn from '@lensshare/ui/cn';


const getTokenGateConditionDescription = (
  tokenGateConditionType: TokenGateCondition
): string => {
  switch (tokenGateConditionType) {
    case TokenGateCondition.HAVE_A_LENS_PROFILE:
      return `have a lens profile`;
    case TokenGateCondition.FOLLOW_A_LENS_PROFILE:
      return `follow a lens profile`;
    case TokenGateCondition.COLLECT_A_POST:
      return `collect a post`;
    case TokenGateCondition.MIRROR_A_POST:
      return `mirror a post`;
  }
};

interface ModuleProps {
  title: string;
  onClick: () => void;
  conditionToShow: TokenGateCondition;
  selectedCondition: TokenGateCondition;
}

const Module: FC<ModuleProps> = ({
  title,
  onClick,
  conditionToShow,
  selectedCondition
}) => (
  <Menu.Item
    as="button"
    className={cn(
      { 'dropdown-active': selectedCondition === conditionToShow },
      'menu-item w-44'
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between space-x-2">
      <span>{`${title}`}</span>
      {selectedCondition === conditionToShow ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      ) : null}
    </div>
  </Menu.Item>
);

const TokenGateForm: FC = () => {
  const {
    isTokenGated,
    setIsTokenGated,
    setTokenGateConditionType,
    tokenGateConditionType,
    setTokenGateConditionValue,
    tokenGateConditionValue
  } = useSpacesStore();

  return (
    <div className="items-center p-5 text-gray-500">
      {[
        TokenGateCondition.MIRROR_A_POST,
        TokenGateCondition.COLLECT_A_POST,
        TokenGateCondition.FOLLOW_A_LENS_PROFILE
      ].includes(tokenGateConditionType) && (
        <div className="flex-1 px-3">
          {tokenGateConditionType ===
          TokenGateCondition.FOLLOW_A_LENS_PROFILE ? (
            <SearchProfile
             
              placeholder={`Search for lens profile...`}
            
            />
          ) : (
            <Input
              label="Enter Lens post link"
              placeholder={`Lens post link`}
              value={tokenGateConditionValue}
              onChange={(e) => setTokenGateConditionValue(e.target.value)}
              className="placeholder-gray-400"
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <Toggle
          on={isTokenGated}
          setOn={() => setIsTokenGated(!isTokenGated)}
        />
        <div className="flex items-start gap-1">
          <span className="text-gray-400 dark:text-gray-500">
            Token gate with
          </span>
          <Menu as="div" className="relative">
            <Menu.Button>
              <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <span>
                  {getTokenGateConditionDescription(tokenGateConditionType)}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </Menu.Button>
            <MenuTransition>
              <Menu.Items className="absolute right-0 w-48 rounded-lg border bg-white text-sm shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900">
                <Module
                  title={`have a lens profile`}
                  onClick={() =>
                    setTokenGateConditionType(
                      TokenGateCondition.HAVE_A_LENS_PROFILE
                    )
                  }
                  conditionToShow={TokenGateCondition.HAVE_A_LENS_PROFILE}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={`follow a lens profile`}
                  onClick={() =>
                    setTokenGateConditionType(
                      TokenGateCondition.FOLLOW_A_LENS_PROFILE
                    )
                  }
                  conditionToShow={TokenGateCondition.FOLLOW_A_LENS_PROFILE}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={`collect a post`}
                  onClick={() =>
                    setTokenGateConditionType(TokenGateCondition.COLLECT_A_POST)
                  }
                  conditionToShow={TokenGateCondition.COLLECT_A_POST}
                  selectedCondition={tokenGateConditionType}
                />
                <Module
                  title={`mirror a post`}
                  onClick={() =>
                    setTokenGateConditionType(TokenGateCondition.MIRROR_A_POST)
                  }
                  conditionToShow={TokenGateCondition.MIRROR_A_POST}
                  selectedCondition={tokenGateConditionType}
                />
              </Menu.Items>
            </MenuTransition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TokenGateForm;
