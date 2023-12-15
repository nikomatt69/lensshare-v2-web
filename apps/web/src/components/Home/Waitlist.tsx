import { STATIC_ASSETS_URL } from '@lensshare/data/constants';
import { MISCELLANEOUS } from '@lensshare/data/tracking';
import { Button, Card } from '@lensshare/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

const Waitlist: FC = () => {
  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <img
        src={`${STATIC_ASSETS_URL}/images/icon.png`}
        alt="Dizzy emoji"
        className="mx-auto h-14 w-14"
      />
      <div className="space-y-3 text-center">
        <div className="font-bold">Get early access to Lens!</div>
        <div>
          <Link href="https://waitlist.lens.xyz?utm_source=lensshare" target="_blank">
            <Button
              variant="secondary"
              size="lg"
             
            >
              Join waitlist
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Waitlist;
