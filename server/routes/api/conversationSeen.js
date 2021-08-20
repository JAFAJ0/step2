const router = require("express").Router();
const { User, Conversation, ConversationSeen, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
// expects {recipientId, senderId, conversationId,senderSeen} in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const userId = req.user.id;
        const { recipientId, conversationId, senderSeen, senderId } = req.body;
        if (!recipientId || !conversationId || !senderSeen) {
            return res.sendStatus(401);
        }
        //check if there exist a conversationSeen with such information and its id matches.
        let conversationSeen1 = await ConversationSeen.findOne({
            where: {
                conversationId: conversationId,
            }
        });
        let conversation = await Conversation.findConversation(
            senderId,
            recipientId
        );
        //If no conversation with such id, then there must be something wrong.
        if (!conversation || conversation.id !== conversationId) {
            return res.sendStatus(401);
        }
        //if such conversation do not exist, that means we need to create one
        if (!conversationSeen1) {
            user1Seen = (senderId === conversation.user1Id) ? senderSeen : 0;
            user2Seen = (senderId === conversation.user1Id) ? senderSeen : 0;
            await ConversationSeen.create({
                conversationId: conversation.id,
                user1Seen: user1Seen,
                user2Seen: user2Seen
            });

        } else {
            if (conversation.user1Id === senderId) {
                await ConversationSeen.update({
                    user1Seen: senderSeen,
                }, {
                    where: {
                        conversationId: conversationId,
                    }
                });
            }
            else {
                await ConversationSeen.update({
                    user2Seen: senderSeen,
                }, {
                    where: {
                        conversationId: conversationId,
                    }
                });
            }
        }
        let conversationSeen = await ConversationSeen.findOne({
            where: {
                conversationId: conversationId,
            }
        });
        res.json({ conversationSeen });

    } catch (error) {
        next(error);
    }
});
module.exports = router;