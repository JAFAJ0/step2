const router = require("express").Router();
const { User, Conversation, ConversationSeen, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();
      //set properties for last seen message for both users.
      let conversationSeen = await ConversationSeen.findOne({
        where: {
          conversationId: convoJSON.id,
        }
      });
      //if the database do not have record, no matter what happened, set seen to the lastest.
      if (!conversationSeen) {
        convoJSON.userSeen = 0;
        convoJSON.otherUserSeen = 0;
        await ConversationSeen.create({
          conversationId: convoJSON.id,
          user1Seen: 0,
          user2Seen: 0
        });
      }
      const user1Seen = (!conversationSeen) ? 0 : conversationSeen.user1Seen;
      const user2Seen = (!conversationSeen) ? 0 : conversationSeen.user2Seen;
      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        convoJSON.otherUserSeen = user1Seen;
        convoJSON.userSeen = user2Seen;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        convoJSON.otherUserSeen = user2Seen;
        convoJSON.userSeen = user1Seen;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }
      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.messages.reverse();
      let otherUserSeen0 = 0;
      if (convoJSON.messages[convoJSON.otherUserSeen - 1].senderId === convoJSON.otherUser.id) {
        for (let i = convoJSON.otherUserSeen; i > 0; i--) {
          if (convoJSON.messages[i - 1].senderId !== convoJSON.otherUser.id) {
            otherUserSeen0 = i;
            break;
          }
        }
        convoJSON.otherUserSeen = otherUserSeen0;
      }
      conversations[i] = convoJSON;

    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
