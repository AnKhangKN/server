const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/env");

dotenv.config();

// Gọi hàm kết nối MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
