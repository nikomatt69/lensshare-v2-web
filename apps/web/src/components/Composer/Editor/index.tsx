import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import { Errors } from '@lensshare/data/errors';
import {
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  COMMAND_PRIORITY_NORMAL,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND
} from 'lexical';
import type { FC } from 'react';
import { Image } from '@lensshare/ui';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { useAppStore } from 'src/store/persisted/useAppStore';

import getAvatar from '@lensshare/lib/getAvatar';
import {  usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

const Editor: FC = () => {

  const { currentProfile } = useAppStore();
  const { setPublicationContent ,attachments} = usePublicationStore();
  const { showPollEditor } = usePublicationStore();
  const { handleUploadAttachments } = useUploadAttachments();
  const [editor] = useLexicalComposerContext();
  const handlePaste = async (pastedFiles: FileList) => {
    if (
      attachments.length === 4 ||
      attachments.length + pastedFiles.length > 4
    ) {
      return toast.error('Please choose either 1 video or up to 4 photos.');
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };
  useEffect(() => {
    return editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  return (
    <div className="item flex p-5">
      <Image
        alt={currentProfile?.id}
        className="mr-3 h-11 w-11 rounded-full border bg-gray-200 dark:border-gray-700"
        src={getAvatar(currentProfile)}
      />
      <div className="relative w-full">
        <EmojiPickerPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="mt-[8.5px] min-h-[80px] overflow-auto leading-6 sm:leading-[26px]" />
          }
          ErrorBoundary={() => <div>{Errors.SomethingWentWrong}</div>}
          placeholder={
            <div className="ld-text-gray-500 pointer-events-none absolute top-2.5">
              {showPollEditor ? 'Ask a question...' : "What's new?!"}
            </div>
          }
        />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const markdown = $convertToMarkdownString(TRANSFORMERS);
              setPublicationContent(markdown);
            });
          }}
        />
        <LexicalAutoLinkPlugin />
        <HistoryPlugin />
        <HashtagPlugin />
        <MentionsPlugin />
        <ImagesPlugin onPaste={handlePaste} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </div>
  );
};

export default Editor;