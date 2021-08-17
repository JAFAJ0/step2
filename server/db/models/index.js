const Conversation = require("./conversation");
const ConversationSeen = require("./conversationSeen");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
ConversationSeen.belongsTo(Conversation);
Conversation.hasOne(ConversationSeen);

module.exports = {
  User,
  Conversation,
  ConversationSeen,
  Message
};
