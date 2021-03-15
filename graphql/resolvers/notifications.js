const { AuthenticationError } = require("apollo-server");

const User = require("../../models/User");

const Notification = require("../../models/Notification");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getUserNotifications(_, {}, context) {
      try {
        const user = checkAuth(context);

        const notifications = await Notification.find({
          receiver: user.id,
          readAt: "",
        }).sort({
          createdAt: -1,
        });
        return notifications;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    // async getAllUserNotifications(_, {}, context) {
    //   try {
    //     const user = checkAuth(context);
    //     console.log("GETTING USER NOTIFICATIONS. the user is" + JSON.stringify(user))
    //     const notifications = await Notification.find({
    //       receiver: user.id,
    //     }).sort({
    //       createdAt: -1,
    //     });
    //     console.log("These are the notifications being returned: " + JSON.stringify(notifications))
    //     return notifications;
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },
  },
  Notification: {
    async sender(parent) {
 
      let user2 = await User.findById(parent.sender);

      return user2;

    },
    async receiver(parent) {
      
      let user2 = await User.findById(parent.receiver)

      return user2;

    },
    
    // async objectId(parent) {
    //   if (parent.objectType == "comment" || parent.objectType == "like") {
    //     let post = await Post.find({ id: parent.objectId }).then(
    //       (posts) => posts[0]
    //     );
    //     console.log("XXXXWE found htis post: " + post);
    //     return post;
    //   } else {
    //     let post2 = null;
    //     return post2;
    //   }
    // },
  },
  Mutation: {
    async createNotification(_, { objectType, objectId, receiver }, context) {
      const user = checkAuth(context);

      ///First, check if notif already exists. If it does, delete it. Else, create it!
      let notifExists = await Notification.findOne({
        objectType,
        objectId,
        receiver,
        sender: user.id,
      });

      console.log("notifExists: " + notifExists);
      if (!notifExists) {
        ///If we get here, that means no error was thrown during the checkAuth phase
        console.log("CREATING NOTIF");

        // if(objectType == "comment"){
        //   let receiverPost = Post.findOne(comments)
        // }
        const newNotification = new Notification({
          objectType, //already destructured at the async line (above)
          objectId,
          receiver,
          sender: user.id,
          createdAt: new Date().toISOString(),
          readAt: "",
        });

        const notification = await newNotification.save();

        context.pubsub.publish("NEW_NOTIFICATION", {
          newNotification: notification,
        });

        return notification;
      } else if (notifExists.readAt != "") {
        ///If we get here, that means no error was thrown during the checkAuth phase
        console.log("CREATING NOTIF");
        const newNotification = new Notification({
          objectType, //already destructured at the async line (above)
          objectId,
          receiver,
          sender: user.id,
          createdAt: new Date().toISOString(),
          readAt: "",
        });

        const notification = await newNotification.save();

        context.pubsub.publish("NEW_NOTIFICATION", {
          newNotification: notification,
        });

        return notification;
      }
    },

    async readNotifications(_, {}, context) {
      try {
        const user = checkAuth(context);

        const notifications = await Notification.find({
          receiver: user.id,
          readAt: "",
        }).sort({
          createdAt: -1,
        });

        var timestamp = new Date();
        for(const notif in notifications){
          if(notif.readAt == ""){
            notif.readAt = timestamp;
            await notif.save();
          }
        }
        return notifications;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    //DO NOT DELETE! IF WE EVER NEED IT, IT'S HERE. IDK. KINDA FUNNY TO LEAVE NOTIFICATIONS.
    // async deleteNotification(_, { objectType, objectId, receiver }, context) {
    //   const user = checkAuth(context);

    //   Notification.deleteOne(
    //     { objectType, objectId, receiver, sender: user.id },
    //     function (err, question) {
    //       if (err) throw err;
    //       console.log("the notifications is deleted");
    //       //NOTE: You can take out the above log but DO NOT remove the function part
    //     }
    //   );
    // },
  },
};
