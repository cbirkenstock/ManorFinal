export const schema = {
  models: {
    Chat: {
      name: "Chat",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        title: {
          name: "title",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
        },
        chatImageUrl: {
          name: "chatImageUrl",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        breadCrumb: {
          name: "breadCrumb",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        eventDateTime: {
          name: "eventDateTime",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
        },
        eventDescription: {
          name: "eventDescription",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        eventLocation: {
          name: "eventLocation",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        limit: {
          name: "limit",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        lastMessage: {
          name: "lastMessage",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        chatCreator: {
          name: "chatCreator",
          isArray: false,
          type: {
            model: "User",
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: "HAS_ONE",
            associatedWith: "id",
            targetName: "chatChatCreatorId",
          },
        },
        Members: {
          name: "Members",
          isArray: true,
          type: {
            model: "ChatUser",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "chat",
          },
        },
        Messages: {
          name: "Messages",
          isArray: true,
          type: {
            model: "Message",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "chatID",
          },
        },
        eventChats: {
          name: "eventChats",
          isArray: true,
          type: {
            model: "Chat",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "chatEventChatsId",
          },
        },
        isGroupChat: {
          name: "isGroupChat",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        isCoreChat: {
          name: "isCoreChat",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        isCoordinationChat: {
          name: "isCoordinationChat",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        isEventChat: {
          name: "isEventChat",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        isActive: {
          name: "isActive",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        membersCount: {
          name: "membersCount",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        parentChat1ID: {
          name: "parentChat1ID",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        parentChat2ID: {
          name: "parentChat2ID",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        editedEventID: {
          name: "editedEventID",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: "updatedAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        chatChatCreatorId: {
          name: "chatChatCreatorId",
          isArray: false,
          type: "ID",
          isRequired: false,
          attributes: [],
        },
        chatEventChatsId: {
          name: "chatEventChatsId",
          isArray: false,
          type: "ID",
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: "Chats",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                allow: "public",
                operations: ["create", "update", "delete", "read"],
              },
            ],
          },
        },
      ],
    },
    User: {
      name: "User",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        name: {
          name: "name",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
        },
        phoneNumber: {
          name: "phoneNumber",
          isArray: false,
          type: "AWSPhone",
          isRequired: true,
          attributes: [],
        },
        profileImageUrl: {
          name: "profileImageUrl",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        venmoHandle: {
          name: "venmoHandle",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        badgeCount: {
          name: "badgeCount",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        chats: {
          name: "chats",
          isArray: true,
          type: {
            model: "ChatUser",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "user",
          },
        },
        expoPushToken: {
          name: "expoPushToken",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: "updatedAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: "Users",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                allow: "public",
                operations: ["create", "update", "delete", "read"],
              },
            ],
          },
        },
      ],
    },
    ChatUser: {
      name: "ChatUser",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        userID: {
          name: "userID",
          isArray: false,
          type: "id",
          isRequired: true,
          attributes: [],
        },
        user: {
          name: "user",
          isArray: false,
          type: {
            model: "User",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "BELONGS_TO",
            targetName: "userID",
          },
        },
        chatID: {
          name: "chatID",
          isArray: false,
          type: "id",
          isRequired: true,
          attributes: [],
        },
        chat: {
          name: "chat",
          isArray: false,
          type: {
            model: "Chat",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "BELONGS_TO",
            targetName: "chatID",
          },
        },
        notificationsEnabled: {
          name: "notificationsEnabled",
          isArray: false,
          type: "Boolean",
          isRequired: true,
          attributes: [],
        },
        nickname: {
          name: "nickname",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        hasUnreadMessage: {
          name: "hasUnreadMessage",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        unreadMessagesCount: {
          name: "unreadMessagesCount",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        isAdmin: {
          name: "isAdmin",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        writtenMessages: {
          name: "writtenMessages",
          isArray: true,
          type: {
            model: "Message",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "chatuserID",
          },
        },
        messages: {
          name: "messages",
          isArray: true,
          type: {
            model: "ChatUserMessage",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "chatUser",
          },
        },
        profileImageUrl: {
          name: "profileImageUrl",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: "updatedAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: "ChatUsers",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "key",
          properties: {
            name: "customByChat",
            fields: ["chatID"],
          },
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                allow: "public",
                operations: ["create", "update", "delete", "read"],
              },
            ],
          },
        },
      ],
    },
    Message: {
      name: "Message",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        marginTop: {
          name: "marginTop",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        rerender: {
          name: "rerender",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        eventChatID: {
          name: "eventChatID",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        messageBody: {
          name: "messageBody",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        announcementBody: {
          name: "announcementBody",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        imageUrl: {
          name: "imageUrl",
          isArray: false,
          type: "String",
          isRequired: false,
          attributes: [],
        },
        chatID: {
          name: "chatID",
          isArray: false,
          type: "ID",
          isRequired: false,
          attributes: [],
        },
        chatuserID: {
          name: "chatuserID",
          isArray: false,
          type: "ID",
          isRequired: false,
          attributes: [],
        },
        chatUsers: {
          name: "chatUsers",
          isArray: true,
          type: {
            model: "ChatUserMessage",
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "message",
          },
        },
        likes: {
          name: "likes",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        link: {
          name: "link",
          isArray: false,
          type: "AWSURL",
          isRequired: false,
          attributes: [],
        },
        isMandatory: {
          name: "isMandatory",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        imageHeight: {
          name: "imageHeight",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        imageWidth: {
          name: "imageWidth",
          isArray: false,
          type: "Int",
          isRequired: false,
          attributes: [],
        },
        isAccepted: {
          name: "isAccepted",
          isArray: false,
          type: "Boolean",
          isRequired: false,
          attributes: [],
        },
        dateSuggestion: {
          name: "dateSuggestion",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
        },
        remindDate: {
          name: "remindDate",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: "updatedAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: "Messages",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "key",
          properties: {
            name: "byChat",
            fields: ["chatID"],
          },
        },
        {
          type: "key",
          properties: {
            name: "byChatUser",
            fields: ["chatuserID"],
          },
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                allow: "public",
                operations: ["create", "update", "delete", "read"],
              },
            ],
          },
        },
      ],
    },
    ChatUserMessage: {
      name: "ChatUserMessage",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        chatUser: {
          name: "chatUser",
          isArray: false,
          type: {
            model: "ChatUser",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "BELONGS_TO",
            targetName: "chatUserID",
          },
        },
        message: {
          name: "message",
          isArray: false,
          type: {
            model: "Message",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "BELONGS_TO",
            targetName: "messageID",
          },
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: "updatedAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: "ChatUserMessages",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "key",
          properties: {
            name: "byChatUser",
            fields: ["chatUserID"],
          },
        },
        {
          type: "key",
          properties: {
            name: "byMessage",
            fields: ["messageID"],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: "f27dcfb699cf0b9d0f06f20b3376c619",
};
