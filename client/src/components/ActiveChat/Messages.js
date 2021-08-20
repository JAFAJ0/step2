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
    <Box >
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        return (
          <Box key={message.id} >
            {message.senderId === userId ? (
              <SenderBubble text={message.text} time={time} />
            ) : (
              <OtherUserBubble text={message.text} time={time} otherUser={otherUser} />
            )}
            <Box className={classes.root} >
              {index + 1 === otherUserSeen && <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>}
            </Box>
          </Box>);
      })}
    </Box>
  );
};

export default Messages;
