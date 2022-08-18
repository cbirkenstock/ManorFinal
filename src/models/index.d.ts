import {
  ModelInit,
  MutableModel,
  PersistentModelConstructor,
} from "@aws-amplify/datastore";

type ChatMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

type UserMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

type ChatUserMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

type MessageMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

type PendingAnnouncementMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

type ReactionMetaData = {
  readOnlyFields: "createdAt" | "updatedAt";
};

export declare class Chat {
  readonly id: string;
  readonly title?: string | null;
  readonly chatImageUrl?: string | null;
  readonly breadCrumb?: string | null;
  readonly displayUserName?: string | null;
  readonly displayUserProfileImageUrl?: string | null;
  readonly displayUserVenmoHandle?: string | null;
  readonly eventDateTime?: string | null;
  readonly eventDescription?: string | null;
  readonly eventLocation?: string | null;
  readonly limit?: number | null;
  readonly lastMessage?: string | null;
  readonly chatCreator?: User | null;
  readonly Members?: (ChatUser | null)[] | null;
  readonly Messages?: (Message | null)[] | null;
  readonly eventChats?: (Chat | null)[] | null;
  readonly isGroupChat?: boolean | null;
  readonly isCoreChat?: boolean | null;
  readonly isCoordinationChat?: boolean | null;
  readonly isEventChat?: boolean | null;
  readonly membersCount?: number | null;
  readonly parentChat1ID?: string | null;
  readonly parentChat2ID?: string | null;
  readonly editedEventID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatChatCreatorId?: string | null;
  readonly chatEventChatsId?: string | null;
  constructor(init: ModelInit<Chat, ChatMetaData>);
  static copyOf(
    source: Chat,
    mutator: (
      draft: MutableModel<Chat, ChatMetaData>
    ) => MutableModel<Chat, ChatMetaData> | void
  ): Chat;
}

export declare class User {
  readonly id: string;
  readonly cognitoUserSub: string;
  readonly name: string;
  readonly phoneNumber: string;
  readonly profileImageUrl?: string | null;
  readonly venmoHandle?: string | null;
  readonly badgeCount?: string | null;
  readonly chats?: (ChatUser | null)[] | null;
  readonly expoPushToken?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(
    source: User,
    mutator: (
      draft: MutableModel<User, UserMetaData>
    ) => MutableModel<User, UserMetaData> | void
  ): User;
}

export declare class ChatUser {
  readonly id: string;
  readonly user: User;
  readonly userID: string;
  readonly chat: Chat;
  readonly chatID: string;
  readonly isOfActiveChat: boolean;
  readonly notificationsEnabled: boolean;
  readonly nickname?: string | null;
  readonly hasUnreadMessage?: boolean | null;
  readonly hasUnreadAnnouncement?: boolean | null;
  readonly unreadMessagesCount?: number | null;
  readonly isAdmin?: boolean | null;
  readonly writtenMessages?: (Message | null)[] | null;
  readonly unreadAnnouncements?: (PendingAnnouncement | null)[] | null;
  readonly reactions?: (Reaction | null)[] | null;
  readonly profileImageUrl?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ChatUser, ChatUserMetaData>);
  static copyOf(
    source: ChatUser,
    mutator: (
      draft: MutableModel<ChatUser, ChatUserMetaData>
    ) => MutableModel<ChatUser, ChatUserMetaData> | void
  ): ChatUser;
}

export declare class Message {
  readonly id: string;
  readonly marginTop?: number | null;
  readonly rerender?: boolean | null;
  readonly isEventMessage?: boolean | null;
  readonly eventChatID?: string | null;
  readonly eventTitle?: string | null;
  readonly eventDateTime?: string | null;
  readonly eventDescription?: string | null;
  readonly eventLocation?: string | null;
  readonly eventCapacity?: number | null;
  readonly eventMembersCount?: number | null;
  readonly suggestionStatus?: string | null;
  readonly messageBody?: string | null;
  readonly isAnnouncementMessage?: boolean | null;
  readonly announcementBody?: string | null;
  readonly imageUrl?: string | null;
  readonly chatID?: string | null;
  readonly chatuserID?: string | null;
  readonly unreachedMembers?: (PendingAnnouncement | null)[] | null;
  readonly reactions?: (Reaction | null)[] | null;
  readonly likes?: number | null;
  readonly dislikes?: number | null;
  readonly link?: string | null;
  readonly isMandatory?: boolean | null;
  readonly imageHeight?: number | null;
  readonly imageWidth?: number | null;
  readonly isAccepted?: boolean | null;
  readonly dateSuggestion?: string | null;
  readonly remindDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly replyToMessageID?: string | null;
  readonly replyToMessageSenderName?: string | null;
  readonly replyToMessageBody?: string | null;
  readonly replyToMessageImageUrl?: string | null;
  readonly urlPreviewImageUrl?: string;
  readonly urlPreviewTitle?: string;
  readonly urlPreviewWebsiteUrl?: string;
  constructor(init: ModelInit<Message, MessageMetaData>);
  static copyOf(
    source: Message,
    mutator: (
      draft: MutableModel<Message, MessageMetaData>
    ) => MutableModel<Message, MessageMetaData> | void
  ): Message;
}

export declare class PendingAnnouncement {
  readonly id: string;
  readonly chatUser: ChatUser;
  readonly chatUserID: string;
  readonly message: Message;
  readonly messageID: string;
  readonly remindDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(
    init: ModelInit<PendingAnnouncement, PendingAnnouncementMetaData>
  );
  static copyOf(
    source: PendingAnnouncement,
    mutator: (
      draft: MutableModel<PendingAnnouncement, PendingAnnouncementMetaData>
    ) => MutableModel<PendingAnnouncement, PendingAnnouncementMetaData> | void
  ): PendingAnnouncement;
}

export declare class Reaction {
  readonly id: string;
  readonly chatUser: ChatUser;
  readonly chatUserID: string;
  readonly message: Message;
  readonly messageID: string;
  readonly reactionType: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Reaction, ReactionMetaData>);
  static copyOf(
    source: Reaction,
    mutator: (
      draft: MutableModel<Reaction, ReactionMetaData>
    ) => MutableModel<Reaction, ReactionMetaData> | void
  ): Reaction;
}
