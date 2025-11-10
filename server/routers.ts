import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import { getUserByOpenId } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  forms: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getFormsByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const form = await db.getFormById(input.id);
        if (!form) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return form;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          fields: z.string(),
          styles: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db.createForm({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || null,
          fields: input.fields,
          styles: input.styles,
          published: 0,
          emailNotifications: 1,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          fields: z.string().optional(),
          styles: z.string().optional(),
          published: z.number().optional(),
          emailNotifications: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const form = await db.getFormById(input.id);
        if (!form) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        const { id, ...updateData } = input;
        await db.updateForm(id, updateData);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const form = await db.getFormById(input.id);
        if (!form) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        await db.deleteForm(input.id);
        return { success: true };
      }),

    publish: protectedProcedure
      .input(z.object({ id: z.number(), published: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        const form = await db.getFormById(input.id);
        if (!form) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        await db.updateForm(input.id, { published: input.published ? 1 : 0 });
        return { success: true };
      }),

    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const originalForm = await db.getFormById(input.id);
        if (!originalForm) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (originalForm.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }

        // Create a copy with modified title
        const newTitle = `${originalForm.title} (Copia)`;
        const newForm = await db.createForm({
          userId: ctx.user.id,
          title: newTitle,
          description: originalForm.description,
          fields: originalForm.fields,
          styles: originalForm.styles,
          published: 0, // New form starts unpublished
          emailNotifications: originalForm.emailNotifications,
        });

        return { id: newForm.id, success: true };
      }),
  }),

  submissions: router({
    list: protectedProcedure
      .input(z.object({ formId: z.number() }))
      .query(async ({ input, ctx }) => {
        const form = await db.getFormById(input.formId);
        if (!form) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
        }
        if (form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return await db.getSubmissionsByFormId(input.formId);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const submission = await db.getSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }
        const form = await db.getFormById(submission.formId);
        if (!form || form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return submission;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const submission = await db.getSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }
        const form = await db.getFormById(submission.formId);
        if (!form || form.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        await db.deleteSubmission(input.id);
        return { success: true };
      }),
  }),

  public: router({
    getForm: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const form = await db.getFormById(input.id);
        if (!form || form.published !== 1) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or not published" });
        }
        return form;
      }),

    submit: publicProcedure
      .input(
        z.object({
          formId: z.number(),
          data: z.string(),
          ipAddress: z.string().optional(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const form = await db.getFormById(input.formId);
        if (!form || form.published !== 1) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or not published" });
        }
        
        // Create submission
        await db.createSubmission({
          formId: input.formId,
          data: input.data,
          ipAddress: input.ipAddress || null,
          userAgent: input.userAgent || null,
        });

        // Send email notification if enabled
        if (form.emailNotifications === 1) {
          try {
            const submissionData = JSON.parse(input.data);
            const fields = JSON.parse(form.fields);
            
            // Format submission data for email
            let formattedData = "";
            fields.forEach((field: any) => {
              const value = submissionData[field.id];
              if (value !== undefined && value !== null && value !== "") {
                const displayValue = Array.isArray(value) ? value.join(", ") : value;
                formattedData += `**${field.label}:** ${displayValue}\n\n`;
              }
            });

            await notifyOwner({
              title: `Nuova submission: ${form.title}`,
              content: `Hai ricevuto una nuova risposta al form "${form.title}".\n\n${formattedData}\n---\n\nVisualizza tutte le risposte nella dashboard.`,
            });
          } catch (error) {
            console.error("Failed to send email notification:", error);
            // Don't fail the submission if notification fails
          }
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
