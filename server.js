const dotenv = require("dotenv");
const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
