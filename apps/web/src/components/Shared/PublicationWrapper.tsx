import type { AnyPublication } from '@lensshare/lens';
import cn from '@lensshare/ui/cn';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { type FC, type ReactNode } from 'react';

interface PublicationWrapperProps {
  publication: AnyPublication;
  className?: string;
  children: ReactNode[];
}

const PublicationWrapper: FC<PublicationWrapperProps> = ({
  publication,
  className = '',
  children
}) => {
  const { push } = useRouter();

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(className)}
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          publication;
          push(`/posts/${publication?.id}`);
        }
      }}
    >
      {children}
    </motion.article>
  );
};

export default PublicationWrapper;
