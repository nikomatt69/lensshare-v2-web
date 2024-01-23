import BytesOutline from '@components/Icons/BytesOutline';
import {
  EnvelopeIcon,
  HomeIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BottomNavigation = () => {
  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white pb-3.5 dark:border-gray-800 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="mx-auto my-2">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/explore" className="mx-auto my-2">
          {isActivePath('/explore') ? (
            <Squares2X2IconSolid className="text-brand h-6 w-6" />
          ) : (
            <Squares2X2Icon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/bytes" className="mx-auto my-2">
          {isActivePath('/bytes') ? (
            <BytesOutline className="text-brand h-6 w-6" />
          ) : (
            <BytesOutline className="h-6 w-6" />
          )}
        </Link>

        <Link href="/xmtp" className="mx-auto my-2">
          {isActivePath('/xmtp') ? (
            <EnvelopeIcon className="text-brand h-6 w-6" />
          ) : (
            <EnvelopeIcon className=" h-6 w-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
