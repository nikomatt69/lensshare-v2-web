
import { COVER } from '@lensshare/data/constants'
import { Profile } from '@lensshare/lens'
import getAvatar from '@lensshare/lib/getAvatar'
import sanitizeDStorageUrl from '@lensshare/lib/sanitizeDStorageUrl'
import { Avatar, Flex, HoverCard, Inset, Text } from '@radix-ui/themes'
import Link from 'next/link'
import type { FC, ReactElement } from 'react'
import React from 'react'
import { getProfile } from 'src/hooks/getProfile'
import { getProfilePicture } from 'src/hooks/getProfilePicture'
import { imageCdn } from 'src/hooks/imageCdn'
import { useAppStore } from 'src/store/useAppStore'


type Props = {
  profile: Profile
  fontSize?: '1' | '2' | '3' | '4' | '5'
  children?: ReactElement
  pfp?: ReactElement
}

const HoverableProfile: FC<Props> = ({
  profile,
  fontSize = '2',
  children,
  pfp
}) => {
  const activeProfile = useAppStore((state) => state.currentProfile)
  const isMyProfile = activeProfile?.id === profile.id

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        {children ?? (
          <Link href={getProfile(profile)?.link}>
            <Flex align="center" gap="1">
              {pfp}
              <Text size={fontSize} highContrast>
                {getProfile(profile)?.slug}
              </Text>
              
            </Flex>
          </Link>
        )}
      </HoverCard.Trigger>
      <HoverCard.Content className="w-80">
        <Inset side="top" pb="current">
          <div
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getAvatar(profile, COVER))
              )})`
            }}
            className="bg-brand-500 relative h-24 w-full bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute bottom-3 left-3 flex-none">
              <Avatar
                className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                src={getProfilePicture(profile, 'AVATAR')}
                size="4"
                fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                radius="large"
                alt={getProfile(activeProfile)?.displayName}
              />
            </div>
            <div className="absolute bottom-3 right-3 flex-none">
              
            </div>
          </div>
        </Inset>
        <div>
          <Link
            href={getProfile(profile)?.link}
            className="flex items-center space-x-1"
          >
            <span className="truncate text-xl font-bold">
              {getProfile(profile)?.displayName}
            </span>
            
          </Link>
          {profile.metadata?.bio && (
            <div className="line-clamp-3 py-1">{profile.metadata?.bio}</div>
          )}
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}

export default HoverableProfile
