// 사용법: npm run seed
import { MongoClient } from "mongodb";
import { defaultProfile, defaultProjects } from "../data/defaults.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI 가 없어요. .env.local 먼저 만들어주세요.");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "portfolio");

  await db
    .collection("profile")
    .replaceOne({}, defaultProfile, { upsert: true });

  const projects = db.collection("projects");
  await projects.createIndex({ slug: 1 }, { unique: true });
  for (const p of defaultProjects) {
    await projects.replaceOne({ slug: p.slug }, p, { upsert: true });
  }

  console.log(`시드 완료: profile 1개, projects ${defaultProjects.length}개`);
} catch (e) {
  console.error("시드 실패:", e.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
