const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/env");
const { initSocket } = require("./src/socket");
const http = require("http");

dotenv.config();

const server = http.createServer(app);

initSocket(server);

// Gọi hàm kết nối MongoDB
connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
