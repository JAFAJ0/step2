const router = require("express").Router();
const { Conversation, Message, ConversationSeen } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      //check if there exist a conversation with such id, and its sender is senderid.
      let conversation0 = await Conversation.findOne({
        where: {
          id: conversationId,
        }
      });
      //if such conversation do not exist, or its user1id and user2id is not senderid, then there must be issue.
      if ((conversation0.user1Id !== senderId && conversation0.user2Id !== senderId) || !conversation0) {
        return res.sendStatus(401);
      }
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      //If no conversation, that means no relevant conversationSeen
      await ConversationSeen.create({
        conversationId: conversation.id,
        user1Seen: 0,
        user2Seen: 0,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;