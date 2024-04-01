import { ContentTypeId } from "@xmtp/xmtp-js";

export const ContentTypeAudioeKey = new ContentTypeId({
  authorityId: 'xmtp.org',
  typeId: 'audio-key',
  versionMajor: 1,
  versionMinor: 0,
})

export class VoiceCodec {
  fallback: any
  get contentType() {
    return ContentTypeAudioeKey;
  }

  encode(key: string | undefined) {
    return {
      type: ContentTypeAudioeKey,
      parameters: {},
      content: new TextEncoder().encode(key)
    };
  }

  decode(content: { content: any }) {
    const uint8Array = content.content;
    const key = new TextDecoder().decode(uint8Array);
    return key;
  }
}