import gql from "graphql-tag";

export const a = gql`
  query ByUserID(
    # $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChatUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byUserID(
      userID: "4363c9dd-13d4-48ae-bf27-fc305d53565a"
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
