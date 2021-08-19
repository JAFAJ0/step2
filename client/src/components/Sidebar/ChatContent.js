import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  badge: {
    right: -3,
    top: 18,
    padding: '0 4px',
    alignItems: "flex-end"
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  const unseen = !isNaN(conversation.messages.length - conversation.userSeen) ? conversation.messages.length - conversation.userSeen : conversation.messages.length;
  return (
    <Box className={classes.root}>
      <Box className={classes.root}>
        <Box>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography className={classes.previewText}>
            {latestMessageText}
          </Typography>
        </Box>
        <Badge badgeContent={unseen} className={classes.badge} color="primary" />
      </Box>
    </Box >
  );
};

export default ChatContent;
