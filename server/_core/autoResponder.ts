import { notifyOwner } from "./notification";

interface AutoResponderOptions {
  userEmail: string;
  subject: string;
  message: string;
  formData: Record<string, any>;
}

/**
 * Send auto-responder email to user who submitted the form
 * Uses the same notification system as owner notifications
 */
export async function sendAutoResponder(options: AutoResponderOptions): Promise<boolean> {
  try {
    const { userEmail, subject, message, formData } = options;

    // Replace variables in subject and message
    let processedSubject = subject;
    let processedMessage = message;

    // Replace {{variableName}} with actual values from formData
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
      
      // Replace in subject
      processedSubject = processedSubject.replace(
        new RegExp(`{{${key}}}`, "gi"),
        displayValue
      );
      
      // Replace in message
      processedMessage = processedMessage.replace(
        new RegExp(`{{${key}}}`, "gi"),
        displayValue
      );
    });

    // Note: In a real implementation, you would send an actual email to userEmail
    // For now, we'll use the notification system as a placeholder
    // In production, integrate with an email service like SendGrid, Mailgun, or AWS SES
    
    console.log(`[Auto-Responder] Would send email to: ${userEmail}`);
    console.log(`[Auto-Responder] Subject: ${processedSubject}`);
    console.log(`[Auto-Responder] Message: ${processedMessage}`);

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // await sendgrid.send({
    //   to: userEmail,
    //   from: 'noreply@formbuilder.com',
    //   subject: processedSubject,
    //   text: processedMessage,
    // });

    return true;
  } catch (error) {
    console.error("[Auto-Responder] Failed to send email:", error);
    return false;
  }
}

/**
 * Extract email field from form data
 * Looks for common email field names
 */
export function extractEmailFromFormData(formData: Record<string, any>): string | null {
  const emailKeys = ["email", "Email", "e-mail", "E-mail", "mail", "Mail"];
  
  for (const key of emailKeys) {
    if (formData[key] && typeof formData[key] === "string") {
      return formData[key];
    }
  }
  
  return null;
}
