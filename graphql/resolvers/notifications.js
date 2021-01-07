const { AuthenticationError } = require("apollo-server");

const User = require("../../models/User");

const Notification = require("../../models/Notification");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getUserNotifications(_, { username }) {
      try {
        const notifications = await Notification.find({
          receiver: username,
        }).sort({
          createdAt: -1,
        });
        //FORMERLY const posts = await Post.find().sort({ createdAt: -1 }).populate('gameId').exec()
        return notifications;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createNotification(_, { objectType, objectId, receiver }, context) {
      const user = checkAuth(context);

      ///First, check if notif already exists. If it does, delete it. Else, create it!
      let notifExists = await Notification.findOne({objectType, objectId, receiver});

      
      if ( notifExists ) {
        console.log("DELETING NOTIF");

        Notification.remove({ id: notifExists.id });
      } else {
        //If we get here, that means no error was thrown during the checkAuth phase
        console.log("CREATING NOTIF");
        const newNotification = new Notification({
          objectType, //already destructured at the async line (above)
          objectId,
          receiver,
          sender: user.id,
          createdAt: new Date().toISOString(),
          readAt: ""
        });

        const notification = await newNotification.save();

        context.pubsub.publish("NEW_NOTIFICATION", {
          newNotification: notification,
        });

        return notification;
      }
    },
  },

  Notfication: {
    async sender(parent) {
      let user = await User.find({ sender: parent.sender }).then(
        (users) => users[0]
      );

      return user;
    },
  },
};
