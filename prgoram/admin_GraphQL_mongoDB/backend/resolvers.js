const User = require("./models/User");

module.exports = {
  Query: {
    users: async () => {
      return await User.find();
    }
  },

  Mutation: {
    addUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return "User added";
    },

    updateUser: async (_, { id, name, email }) => {
      await User.findByIdAndUpdate(id, { name, email });
      return "User updated";
    },

    deleteUser: async (_, { id }) => {
      await User.findByIdAndDelete(id);
      return "User deleted";
    }
  }
};
