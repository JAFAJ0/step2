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
  function ous() {
    let ons = 0;
    for (var i = otherUserSeen; i > 0; i--) {
      if (messages[i - 1].senderId === userId) {
        ons = i;
        break;
      }
    }
    return ons;
  }
  const oUS = ous();
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
            <Box className={classes.root} mb={8}>
              {index + 1 === oUS && <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>}
            </Box>
          </Box>);
      })}
    </Box>
  );
};

export default Messages;
