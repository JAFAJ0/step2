import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  messages.sort(function (a, b) {
    const timea = moment(a.createdAt);
    const timeb = moment(b.createdAt);
    if (timea.isBefore(timeb)) {
      return -1;
    }
    if (timeb.isBefore(timea)) {
      return 1;
    }
    return 0;
  });
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
