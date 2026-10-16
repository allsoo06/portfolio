import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// dev 서버 핫리로드 때 연결이 계속 늘어나는 걸 막으려고 global 에 캐싱
let clientPromise = null;

/** @returns {Promise<import("mongodb").MongoClient> | null} */
export function getClientPromise() {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

/** @returns {Promise<import("mongodb").Db | null>} */
export async function getDb() {
  const promise = getClientPromise();
  if (!promise) return null;
  const client = await promise;
  return client.db(process.env.MONGODB_DB || "portfolio");
}
