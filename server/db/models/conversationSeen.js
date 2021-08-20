const Sequelize = require("sequelize");
const db = require("../db");
const { Conversation } = require("../models");
//This one is used to check where does the sender/recipent seen in the conversation
const ConversationSeen = db.define("conversationSeen", {
    conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    user1Seen: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    user2Seen: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = ConversationSeen;
