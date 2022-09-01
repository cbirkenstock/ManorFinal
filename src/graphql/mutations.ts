/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChat = /* GraphQL */ `
  mutation CreateChat(
    $input: CreateChatInput!
    $condition: ModelChatConditionInput
  ) {
    createChat(input: $input, condition: $condition) {
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
export const updateChat = /* GraphQL */ `
  mutation UpdateChat(
    $input: UpdateChatInput!
    $condition: ModelChatConditionInput
  ) {
    updateChat(input: $input, condition: $condition) {
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
export const deleteChat = /* GraphQL */ `
  mutation DeleteChat(
    $input: DeleteChatInput!
    $condition: ModelChatConditionInput
  ) {
    deleteChat(input: $input, condition: $condition) {
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
export const createChatUser = /* GraphQL */ `
  mutation CreateChatUser(
    $input: CreateChatUserInput!
    $condition: ModelChatUserConditionInput
  ) {
    createChatUser(input: $input, condition: $condition) {
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
export const updateChatUser = /* GraphQL */ `
  mutation UpdateChatUser(
    $input: UpdateChatUserInput!
    $condition: ModelChatUserConditionInput
  ) {
    updateChatUser(input: $input, condition: $condition) {
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
export const deleteChatUser = /* GraphQL */ `
  mutation DeleteChatUser(
    $input: DeleteChatUserInput!
    $condition: ModelChatUserConditionInput
  ) {
    deleteChatUser(input: $input, condition: $condition) {
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
export const createPendingAnnouncement = /* GraphQL */ `
  mutation CreatePendingAnnouncement(
    $input: CreatePendingAnnouncementInput!
    $condition: ModelPendingAnnouncementConditionInput
  ) {
    createPendingAnnouncement(input: $input, condition: $condition) {
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
export const updatePendingAnnouncement = /* GraphQL */ `
  mutation UpdatePendingAnnouncement(
    $input: UpdatePendingAnnouncementInput!
    $condition: ModelPendingAnnouncementConditionInput
  ) {
    updatePendingAnnouncement(input: $input, condition: $condition) {
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
export const deletePendingAnnouncement = /* GraphQL */ `
  mutation DeletePendingAnnouncement(
    $input: DeletePendingAnnouncementInput!
    $condition: ModelPendingAnnouncementConditionInput
  ) {
    deletePendingAnnouncement(input: $input, condition: $condition) {
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
export const createReaction = /* GraphQL */ `
  mutation CreateReaction(
    $input: CreateReactionInput!
    $condition: ModelReactionConditionInput
  ) {
    createReaction(input: $input, condition: $condition) {
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
export const updateReaction = /* GraphQL */ `
  mutation UpdateReaction(
    $input: UpdateReactionInput!
    $condition: ModelReactionConditionInput
  ) {
    updateReaction(input: $input, condition: $condition) {
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
export const deleteReaction = /* GraphQL */ `
  mutation DeleteReaction(
    $input: DeleteReactionInput!
    $condition: ModelReactionConditionInput
  ) {
    deleteReaction(input: $input, condition: $condition) {
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
export const createReport = /* GraphQL */ `
  mutation CreateReport(
    $input: CreateReportInput!
    $condition: ModelReportConditionInput
  ) {
    createReport(input: $input, condition: $condition) {
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
export const updateReport = /* GraphQL */ `
  mutation UpdateReport(
    $input: UpdateReportInput!
    $condition: ModelReportConditionInput
  ) {
    updateReport(input: $input, condition: $condition) {
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
export const deleteReport = /* GraphQL */ `
  mutation DeleteReport(
    $input: DeleteReportInput!
    $condition: ModelReportConditionInput
  ) {
    deleteReport(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
