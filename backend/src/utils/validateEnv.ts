import { cleanEnv } from "envalid";
import { config } from "dotenv";
import { port, str } from "envalid/dist/validators";
config();
const env = cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  FRONTEND_URL: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
});

export default env;
