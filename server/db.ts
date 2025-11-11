import { eq, desc, and, gte, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, forms, InsertForm, submissions, InsertSubmission, formAnalytics, InsertFormAnalytics, teamMembers, InsertTeamMember } from "../drizzle/schema";
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
  await db.delete(submissions).where(eq(submissions.id, id));
}

// Analytics queries
export async function trackFormEvent(event: InsertFormAnalytics) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(formAnalytics).values(event);
  } catch (error) {
    console.error("[Analytics] Failed to track event:", error);
  }
}

export async function getFormAnalytics(formId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = [eq(formAnalytics.formId, formId)];
  
  if (startDate) {
    conditions.push(gte(formAnalytics.createdAt, startDate));
  }
  if (endDate) {
    conditions.push(lte(formAnalytics.createdAt, endDate));
  }
  
  return await db
    .select()
    .from(formAnalytics)
    .where(and(...conditions))
    .orderBy(desc(formAnalytics.createdAt));
}

export async function getFormStats(formId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const views = await db
    .select({ count: count() })
    .from(formAnalytics)
    .where(and(eq(formAnalytics.formId, formId), eq(formAnalytics.event, "view")));
  
  const starts = await db
    .select({ count: count() })
    .from(formAnalytics)
    .where(and(eq(formAnalytics.formId, formId), eq(formAnalytics.event, "start")));
  
  const submits = await db
    .select({ count: count() })
    .from(submissions)
    .where(eq(submissions.formId, formId));
  
  return {
    views: Number(views[0]?.count || 0),
    starts: Number(starts[0]?.count || 0),
    submissions: Number(submits[0]?.count || 0),
  };
}

export async function addTeamMember(member: InsertTeamMember) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(teamMembers).values(member);
  return result;
}

export async function getTeamMembers(formId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const members = await db
    .select({
      id: teamMembers.id,
      formId: teamMembers.formId,
      userId: teamMembers.userId,
      role: teamMembers.role,
      invitedBy: teamMembers.invitedBy,
      createdAt: teamMembers.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(teamMembers)
    .leftJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.formId, formId));
  
  return members;
}

export async function removeTeamMember(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
  return result;
}

export async function getUserRole(formId: number, userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  const member = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.formId, formId), eq(teamMembers.userId, userId)))
    .limit(1);
  
  return member.length > 0 ? member[0].role : null;
}
