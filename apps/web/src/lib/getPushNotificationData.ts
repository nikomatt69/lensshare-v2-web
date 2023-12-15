import type { Notification } from '@lensshare/lens';
import getNoti from 'src/pages/api/getnotification';


const getPushNotificationData = (
  notification: Notification
): {
  title: string;
} | null => {
  switch (notification?.__typename) {
    case 'ActedNotification':
      const actedProfile = notification.actions[0].by;
      const actedHandle =
        actedProfile.handle?.suggestedFormatted.localName || actedProfile.id;
      const actedType = notification.publication.__typename?.toLowerCase();

      return {
        title: `${actedHandle} acted on your ${actedType}  ${getNoti(
          notification.id,
          notification.publication.id
        )}`
      };
    case 'CommentNotification':
      const commentedProfile = notification.comment.by;
      const commentedHandle =
        commentedProfile.handle?.suggestedFormatted.localName ||
        commentedProfile.id;
      const commentedType =
        notification.comment.commentOn.__typename?.toLowerCase();

      return {
        title: `${commentedHandle} commented on your ${commentedType} && ${getNoti(
          notification.id,
          notification.comment.id
        )}`
      };
    case 'MirrorNotification':
      const mirroredProfile = notification.mirrors[0].profile;
      const mirroredHandle =
        mirroredProfile.handle?.suggestedFormatted.localName ||
        mirroredProfile.id;
      const mirroredType = notification.publication.__typename?.toLowerCase();

      return {
        title: `${mirroredHandle} mirrored your ${mirroredType}  ${getNoti(
          notification.id,
          notification.publication.id
        )}`
      };
    case 'MentionNotification':
      const mentionedProfile = notification.publication.by;
      const mentionedHandle =
        mentionedProfile.handle?.suggestedFormatted.localName ||
        mentionedProfile.id;
      const mentionedType = notification.publication.__typename?.toLowerCase();

      return {
        title: `${mentionedHandle} mentioned your on a ${mentionedType} ${getNoti(
          notification.id,
          notification.publication.id
        )}`
      };
    case 'QuoteNotification':
      const quotedProfile = notification.quote.by;
      const quotedHandle =
        quotedProfile.handle?.suggestedFormatted.localName || quotedProfile.id;
      const quotedType = notification.quote.quoteOn.__typename?.toLowerCase();

      return {
        title: `${quotedHandle} quoted your ${quotedType} ${getNoti(
          notification.id,
          notification.quote.id
        )}`
      };
    case 'ReactionNotification':
      const reactedProfile = notification.reactions[0].profile;
      const reactedHandle =
        reactedProfile.handle?.suggestedFormatted.localName ||
        reactedProfile.id;
      const reactedType = notification.publication.__typename?.toLowerCase();

      return {
        title: `${reactedHandle} liked your ${reactedType}  ${getNoti(
          notification.id,
          notification.publication.id
        )}`
      };
    case 'FollowNotification':
      const followedProfile = notification.followers[0];
      const followedHandle =
        followedProfile.handle?.suggestedFormatted.localName ||
        followedProfile.id;

      return {
        title: `${followedHandle} followed you  ${getNoti(
          notification.id,
          notification.id
        )}`
      };
    default:
      return null;
  }
};

export default getPushNotificationData;
