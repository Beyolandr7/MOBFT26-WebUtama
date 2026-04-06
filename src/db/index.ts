import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as relations from "./relations";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" }); // tambah ini

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, {
  schema: { ...schema, ...relations },
  mode: "default",
});
