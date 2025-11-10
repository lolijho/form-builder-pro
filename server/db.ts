import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, forms, InsertForm, submissions, InsertSubmission } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Forms queries
export async function createForm(form: InsertForm) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(forms).values(form);
  // Get the inserted ID from the result
  const insertId = (result as any).insertId || (result as any)[0]?.insertId;
  return { id: insertId as number };
}

export async function getFormById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(forms).where(eq(forms.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFormsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(forms).where(eq(forms.userId, userId));
}

export async function updateForm(id: number, data: Partial<InsertForm>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(forms).set(data).where(eq(forms.id, id));
}

export async function deleteForm(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(submissions).where(eq(submissions.formId, id));
  return await db.delete(forms).where(eq(forms.id, id));
}

// Submissions queries
export async function createSubmission(submission: InsertSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(submissions).values(submission);
  return result;
}

export async function getSubmissionsByFormId(formId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(submissions).where(eq(submissions.formId, formId));
}

export async function getSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSubmission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(submissions).where(eq(submissions.id, id));
}
