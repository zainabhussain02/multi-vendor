const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL)
    .then((data) => {
      console.log(`mongodb connect with server:${data.connection.host}`);
    });
};
module.exports = connectDatabase;



// const mongoose = require("mongoose");

// const connectDatabase = async () => {
//   try {
//     console.log("Connecting to MongoDB...");
//     console.log(`DB_URL: ${process.env.DB_URL}`); // Debugging log

//     const data = await mongoose.connect(process.env.DB_URL);
//     console.log(`MongoDB connected with server: ${data.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDatabase;

