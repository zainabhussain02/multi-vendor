// const app = require("./app");
// const connectDatabase = require("./db/Database");
// // handling uncaught exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error:${err.message}`);
//   console.log(`shutting down the server for handling uncaught exception`);
// });
// // config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({
//       path: "backend/config/.env",
//     });
//   }

// //   connect db
// connectDatabase();

// // create server
// const PORT = process.env.PORT || 3000;
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// // const server = app.listen(process.env.PORT, () => {
// //   console.log(`Server is running on http ://localhost:${process.env.PORT}`);
// // });
// // unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Shutting down the server for ${err.message}`);
//   console.log(`shutting down the server for unhandled promise rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });




const app = require("./app");
const connectDatabase = require("./db/Database");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling uncaught exception");
  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// Connect to database
connectDatabase();

// Create server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log("Shutting down the server for unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
