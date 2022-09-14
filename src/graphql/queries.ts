/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChat = /* GraphQL */ `
  query GetChat($id: ID!) {
    getChat(id: $id) {
      id
      title
      chatImageUrl
      breadCrumb
      displayUserName
      displayUserProfileImageUrl
      displayUserVenmoHandle
      eventDateTime
      eventDescription
      eventLocation
      limit
      lastMessage
      lastMessageSenderID
      chatCreator {
        id
        cognitoUserSub
        name
        phoneNumber
        profileImageUrl
        venmoHandle
        badgeCount
        chats {
          nextToken
          startedAt
        }
        expoPushToken
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      Members {
        items {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      Messages {
        items {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      eventChats {
        items {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        nextToken
        startedAt
      }
      isGroupChat
      isCoreChat
      isCoordinationChat
      isEventChat
      membersCount
      parentChat1ID
      parentChat2ID
      editedEventID
      isDeactivated
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      chatEventChatsId
      chatChatCreatorId
    }
  }
`;
export const listChats = /* GraphQL */ `
  query ListChats(
    $filter: ModelChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        chatImageUrl
        breadCrumb
        displayUserName
        displayUserProfileImageUrl
        displayUserVenmoHandle
        eventDateTime
        eventDescription
        eventLocation
        limit
        lastMessage
        lastMessageSenderID
        chatCreator {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        Members {
          nextToken
          startedAt
        }
        Messages {
          nextToken
          startedAt
        }
        eventChats {
          nextToken
          startedAt
        }
        isGroupChat
        isCoreChat
        isCoordinationChat
        isEventChat
        membersCount
        parentChat1ID
        parentChat2ID
        editedEventID
        isDeactivated
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chatEventChatsId
        chatChatCreatorId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChats = /* GraphQL */ `
  query SyncChats(
    $filter: ModelChatFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChats(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        chatImageUrl
        breadCrumb
        displayUserName
        displayUserProfileImageUrl
        displayUserVenmoHandle
        eventDateTime
        eventDescription
        eventLocation
        limit
        lastMessage
        lastMessageSenderID
        chatCreator {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        Members {
          nextToken
          startedAt
        }
        Messages {
          nextToken
          startedAt
        }
        eventChats {
          nextToken
          startedAt
        }
        isGroupChat
        isCoreChat
        isCoordinationChat
        isEventChat
        membersCount
        parentChat1ID
        parentChat2ID
        editedEventID
        isDeactivated
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chatEventChatsId
        chatChatCreatorId
      }
      nextToken
      startedAt
    }
  }
`;
export const getChatUser = /* GraphQL */ `
  query GetChatUser($id: ID!) {
    getChatUser(id: $id) {
      id
      userID
      chatID
      user {
        id
        cognitoUserSub
        name
        phoneNumber
        profileImageUrl
        venmoHandle
        badgeCount
        chats {
          nextToken
          startedAt
        }
        expoPushToken
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      chat {
        id
        title
        chatImageUrl
        breadCrumb
        displayUserName
        displayUserProfileImageUrl
        displayUserVenmoHandle
        eventDateTime
        eventDescription
        eventLocation
        limit
        lastMessage
        lastMessageSenderID
        chatCreator {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        Members {
          nextToken
          startedAt
        }
        Messages {
          nextToken
          startedAt
        }
        eventChats {
          nextToken
          startedAt
        }
        isGroupChat
        isCoreChat
        isCoordinationChat
        isEventChat
        membersCount
        parentChat1ID
        parentChat2ID
        editedEventID
        isDeactivated
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chatEventChatsId
        chatChatCreatorId
      }
      isOfActiveChat
      notificationsEnabled
      nickname
      hasUnreadMessage
      hasUnreadAnnouncement
      unreadMessagesCount
      isAdmin
      writtenMessages {
        items {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      unreadAnnouncements {
        items {
          id
          chatUserID
          messageID
          remindDate
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      reactions {
        items {
          id
          chatUserID
          messageID
          reactionType
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      profileImageUrl
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listChatUsers = /* GraphQL */ `
  query ListChatUsers(
    $filter: ModelChatUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        chatID
        user {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        chat {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        isOfActiveChat
        notificationsEnabled
        nickname
        hasUnreadMessage
        hasUnreadAnnouncement
        unreadMessagesCount
        isAdmin
        writtenMessages {
          nextToken
          startedAt
        }
        unreadAnnouncements {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        profileImageUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChatUsers = /* GraphQL */ `
  query SyncChatUsers(
    $filter: ModelChatUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChatUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        userID
        chatID
        user {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        chat {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        isOfActiveChat
        notificationsEnabled
        nickname
        hasUnreadMessage
        hasUnreadAnnouncement
        unreadMessagesCount
        isAdmin
        writtenMessages {
          nextToken
          startedAt
        }
        unreadAnnouncements {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        profileImageUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const byUserID = /* GraphQL */ `
  query ByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChatUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        chatID
        user {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        chat {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        isOfActiveChat
        notificationsEnabled
        nickname
        hasUnreadMessage
        hasUnreadAnnouncement
        unreadMessagesCount
        isAdmin
        writtenMessages {
          nextToken
          startedAt
        }
        unreadAnnouncements {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        profileImageUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPendingAnnouncement = /* GraphQL */ `
  query GetPendingAnnouncement($id: ID!) {
    getPendingAnnouncement(id: $id) {
      id
      chatUserID
      messageID
      chatUser {
        id
        userID
        chatID
        user {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        chat {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        isOfActiveChat
        notificationsEnabled
        nickname
        hasUnreadMessage
        hasUnreadAnnouncement
        unreadMessagesCount
        isAdmin
        writtenMessages {
          nextToken
          startedAt
        }
        unreadAnnouncements {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        profileImageUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      message {
        id
        marginTop
        timeCardDateTime
        isEventMessage
        eventChatID
        eventTitle
        eventDateTime
        eventDescription
        eventLocation
        eventCapacity
        eventMembersCount
        suggestionStatus
        messageBody
        isAnnouncementMessage
        announcementBody
        imageUrl
        chatID
        chatuserID
        unreachedMembers {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        likes
        dislikes
        link
        isMandatory
        imageHeight
        imageWidth
        isAccepted
        dateSuggestion
        remindDate
        replyToMessageID
        replyToMessageSenderName
        replyToMessageBody
        replyToMessageImageUrl
        urlPreviewImageUrl
        urlPreviewTitle
        urlPreviewWebsiteUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      remindDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPendingAnnouncements = /* GraphQL */ `
  query ListPendingAnnouncements(
    $filter: ModelPendingAnnouncementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPendingAnnouncements(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        chatUserID
        messageID
        chatUser {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        message {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        remindDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPendingAnnouncements = /* GraphQL */ `
  query SyncPendingAnnouncements(
    $filter: ModelPendingAnnouncementFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPendingAnnouncements(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        chatUserID
        messageID
        chatUser {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        message {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        remindDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getReaction = /* GraphQL */ `
  query GetReaction($id: ID!) {
    getReaction(id: $id) {
      id
      chatUserID
      messageID
      chatUser {
        id
        userID
        chatID
        user {
          id
          cognitoUserSub
          name
          phoneNumber
          profileImageUrl
          venmoHandle
          badgeCount
          expoPushToken
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        chat {
          id
          title
          chatImageUrl
          breadCrumb
          displayUserName
          displayUserProfileImageUrl
          displayUserVenmoHandle
          eventDateTime
          eventDescription
          eventLocation
          limit
          lastMessage
          lastMessageSenderID
          isGroupChat
          isCoreChat
          isCoordinationChat
          isEventChat
          membersCount
          parentChat1ID
          parentChat2ID
          editedEventID
          isDeactivated
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          chatEventChatsId
          chatChatCreatorId
        }
        isOfActiveChat
        notificationsEnabled
        nickname
        hasUnreadMessage
        hasUnreadAnnouncement
        unreadMessagesCount
        isAdmin
        writtenMessages {
          nextToken
          startedAt
        }
        unreadAnnouncements {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        profileImageUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      message {
        id
        marginTop
        timeCardDateTime
        isEventMessage
        eventChatID
        eventTitle
        eventDateTime
        eventDescription
        eventLocation
        eventCapacity
        eventMembersCount
        suggestionStatus
        messageBody
        isAnnouncementMessage
        announcementBody
        imageUrl
        chatID
        chatuserID
        unreachedMembers {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        likes
        dislikes
        link
        isMandatory
        imageHeight
        imageWidth
        isAccepted
        dateSuggestion
        remindDate
        replyToMessageID
        replyToMessageSenderName
        replyToMessageBody
        replyToMessageImageUrl
        urlPreviewImageUrl
        urlPreviewTitle
        urlPreviewWebsiteUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      reactionType
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listReactions = /* GraphQL */ `
  query ListReactions(
    $filter: ModelReactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatUserID
        messageID
        chatUser {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        message {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        reactionType
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncReactions = /* GraphQL */ `
  query SyncReactions(
    $filter: ModelReactionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncReactions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        chatUserID
        messageID
        chatUser {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        message {
          id
          marginTop
          timeCardDateTime
          isEventMessage
          eventChatID
          eventTitle
          eventDateTime
          eventDescription
          eventLocation
          eventCapacity
          eventMembersCount
          suggestionStatus
          messageBody
          isAnnouncementMessage
          announcementBody
          imageUrl
          chatID
          chatuserID
          likes
          dislikes
          link
          isMandatory
          imageHeight
          imageWidth
          isAccepted
          dateSuggestion
          remindDate
          replyToMessageID
          replyToMessageSenderName
          replyToMessageBody
          replyToMessageImageUrl
          urlPreviewImageUrl
          urlPreviewTitle
          urlPreviewWebsiteUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        reactionType
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      reportedUserID
      lastFiveMessages
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        reportedUserID
        lastFiveMessages
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncReports = /* GraphQL */ `
  query SyncReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncReports(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        reportedUserID
        lastFiveMessages
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      cognitoUserSub
      name
      phoneNumber
      profileImageUrl
      venmoHandle
      badgeCount
      chats {
        items {
          id
          userID
          chatID
          isOfActiveChat
          notificationsEnabled
          nickname
          hasUnreadMessage
          hasUnreadAnnouncement
          unreadMessagesCount
          isAdmin
          profileImageUrl
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      expoPushToken
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cognitoUserSub
        name
        phoneNumber
        profileImageUrl
        venmoHandle
        badgeCount
        chats {
          nextToken
          startedAt
        }
        expoPushToken
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        cognitoUserSub
        name
        phoneNumber
        profileImageUrl
        venmoHandle
        badgeCount
        chats {
          nextToken
          startedAt
        }
        expoPushToken
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      marginTop
      timeCardDateTime
      isEventMessage
      eventChatID
      eventTitle
      eventDateTime
      eventDescription
      eventLocation
      eventCapacity
      eventMembersCount
      suggestionStatus
      messageBody
      isAnnouncementMessage
      announcementBody
      imageUrl
      chatID
      chatuserID
      unreachedMembers {
        items {
          id
          chatUserID
          messageID
          remindDate
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      reactions {
        items {
          id
          chatUserID
          messageID
          reactionType
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      likes
      dislikes
      link
      isMandatory
      imageHeight
      imageWidth
      isAccepted
      dateSuggestion
      remindDate
      replyToMessageID
      replyToMessageSenderName
      replyToMessageBody
      replyToMessageImageUrl
      urlPreviewImageUrl
      urlPreviewTitle
      urlPreviewWebsiteUrl
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        marginTop
        timeCardDateTime
        isEventMessage
        eventChatID
        eventTitle
        eventDateTime
        eventDescription
        eventLocation
        eventCapacity
        eventMembersCount
        suggestionStatus
        messageBody
        isAnnouncementMessage
        announcementBody
        imageUrl
        chatID
        chatuserID
        unreachedMembers {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        likes
        dislikes
        link
        isMandatory
        imageHeight
        imageWidth
        isAccepted
        dateSuggestion
        remindDate
        replyToMessageID
        replyToMessageSenderName
        replyToMessageBody
        replyToMessageImageUrl
        urlPreviewImageUrl
        urlPreviewTitle
        urlPreviewWebsiteUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMessages = /* GraphQL */ `
  query SyncMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMessages(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        marginTop
        timeCardDateTime
        isEventMessage
        eventChatID
        eventTitle
        eventDateTime
        eventDescription
        eventLocation
        eventCapacity
        eventMembersCount
        suggestionStatus
        messageBody
        isAnnouncementMessage
        announcementBody
        imageUrl
        chatID
        chatuserID
        unreachedMembers {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        likes
        dislikes
        link
        isMandatory
        imageHeight
        imageWidth
        isAccepted
        dateSuggestion
        remindDate
        replyToMessageID
        replyToMessageSenderName
        replyToMessageBody
        replyToMessageImageUrl
        urlPreviewImageUrl
        urlPreviewTitle
        urlPreviewWebsiteUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const byChat = /* GraphQL */ `
  query ByChat(
    $chatID: ID!
    $createdAt: ModelStringKeyConditionInput
    # $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byChat(
      chatID: $chatID
      createdAt: $createdAt
      sortDirection: DESC
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        marginTop
        timeCardDateTime
        isEventMessage
        eventChatID
        eventTitle
        eventDateTime
        eventDescription
        eventLocation
        eventCapacity
        eventMembersCount
        suggestionStatus
        messageBody
        isAnnouncementMessage
        announcementBody
        imageUrl
        chatID
        chatuserID
        unreachedMembers {
          nextToken
          startedAt
        }
        reactions {
          nextToken
          startedAt
        }
        likes
        dislikes
        link
        isMandatory
        imageHeight
        imageWidth
        isAccepted
        dateSuggestion
        remindDate
        replyToMessageID
        replyToMessageSenderName
        replyToMessageBody
        replyToMessageImageUrl
        urlPreviewImageUrl
        urlPreviewTitle
        urlPreviewWebsiteUrl
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
