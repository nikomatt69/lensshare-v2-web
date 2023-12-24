import { APP_NAME } from '@lensshare/data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import urlcat from 'urlcat';

const Footer: FC = () => {
  return (
    <footer className={`'top-20'} sticky text-sm leading-7`}>
      <div className="mt-4 flex flex-wrap gap-x-[12px] px-3 lg:px-0">
        <span className="lt-text-gray-500 font-bold">
          &copy; {new Date().getFullYear()} Lenshareapp.xyz
        </span>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link
          href="https://lenshareapp.xyz/discord"
          target="_blank"
          rel="noreferrer noopener"
        >
          Discord
        </Link>
        <Link
          href="https://lenshareapp.xyz/donate"
          target="_blank"
          rel="noreferrer noopener"
        >
          Donate
        </Link>
        <Link
          href="https://status.lenshareapp.xyz"
          target="_blank"
          rel="noreferrer noopener"
        >
          Status
        </Link>
        <Link
          href="https://feedback.lenshareapp.xyz"
          target="_blank"
          rel="noreferrer noopener"
        >
          Feedback
        </Link>
        <Link href="/thanks">Thanks</Link>
        <Link
          href="https://github.com/nikomatt69/LensShare-2.0"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </Link>
        <Link
          href="https://translate.lenshareapp.xyz"
          target="_blank"
          rel="noreferrer noopener"
        >
          Translate
        </Link>
      </div>
      <div className="mt-2">
        <Link
          className="hover:font-bold"
          href={urlcat('https://vercel.com', {
            utm_source: APP_NAME,
            utm_campaign: 'oss'
          })}
          target="_blank"
          rel="noreferrer noopener"
        >
          ▲ Powered by Vercel
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
