import { getDb } from "./mongodb";
import { defaultProfile, defaultProjects } from "../data/defaults.mjs";
import type { Profile, Project } from "./types";

// DB 연결이 안 되거나 비어있으면 defaults 로 fallback 해서 사이트가 항상 뜨게 한다.

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export async function getProfile(): Promise<Profile> {
  try {
    const db = await getDb();
    if (db) {
      const doc = await db
        .collection("profile")
        .findOne({}, { projection: { _id: 0 } });
      if (doc) return doc as unknown as Profile;
    }
  } catch (e) {
    console.error("[getProfile] DB error:", errMsg(e));
  }
  return defaultProfile;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDb();
    if (db) {
      const docs = await db
        .collection("projects")
        .find({}, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray();
      if (docs.length > 0) return docs as unknown as Project[];
    }
  } catch (e) {
    console.error("[getProjects] DB error:", errMsg(e));
  }
  return [...defaultProjects].sort((a, b) => a.order - b.order);
}
