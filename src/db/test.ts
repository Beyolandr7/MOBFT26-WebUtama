import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db.execute(sql`SELECT 1`);
  console.log("DB connected:", result);
}

main().catch(console.error);
