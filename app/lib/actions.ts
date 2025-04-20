"use server";

import postgres from "postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "please select a customer",
  }),
  amount: z.coerce.number().gt(0, { message: "amount must be greater than 0" }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "please select a status",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate empty fields
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  // Initial empty fields check
  if (!rawFormData.customerId || !rawFormData.amount || !rawFormData.status) {
    return {
      errors: {
        customerId: !rawFormData.customerId
          ? ["Please select a customer"]
          : undefined,
        amount: !rawFormData.amount ? ["Please enter an amount"] : undefined,
        status: !rawFormData.status
          ? ["Please select an invoice status"]
          : undefined,
      },
      message: "Missing required fields. Please fill in all fields.",
    };
  }

  const validatedFields = CreateInvoice.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  try {
    // Validate that customerId exists in the customers table
    const customerCheck = await sql`
      SELECT id FROM customers WHERE id = ${customerId}::uuid
    `;

    if (customerCheck.length === 0) {
      return {
        message: "Invalid customer selected.",
      };
    }

    const amountInCents = Math.round(amount * 100);
    const date = new Date().toISOString().split("T")[0];

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}::uuid, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    console.error("Failed to create invoice:", err);
    return {
      message: "Database Error: Failed to create invoice. Please try again.",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  // Validate empty fields
  const rawFormData = {
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  };
  // Initial empty fields check
  if (!rawFormData.customerId || !rawFormData.amount || !rawFormData.status) {
    return {
      errors: {
        customerId: !rawFormData.customerId
          ? ["Please select a customer"]
          : undefined,
        amount: !rawFormData.amount ? ["Please enter an amount"] : undefined,
        status: !rawFormData.status
          ? ["Please select an invoice status"]
          : undefined,
      },
      message: "Missing required fields. Please fill in all fields.",
    };
  }

  const validatedFields = UpdateInvoice.safeParse({
    rawFormData,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error("Failed to update invoice:", err);
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE from invoices WHERE  id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: true,
      redirectTo: formData.get("redirectTo")?.toString() || "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid credentials.";
    }
    throw error;
  }
}
