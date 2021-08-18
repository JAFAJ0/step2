import React from "react";
import { Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  avatar: {
    height: 20,
    width: 20,
    marginLeft: 11,
    marginTop: 2,
  },

}));
const Messages = (props) => {
  const { messages, otherUser, userId, otherUserSeen } = props;
  const classes = useStyles();
  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        return message.senderId === userId ? (
          <Box className={classes.root} key={message.id}>
            <SenderBubble text={message.text} time={time} />
            {index === otherUserSeen && <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>}
          </Box>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
