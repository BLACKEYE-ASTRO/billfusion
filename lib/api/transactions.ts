export type TransactionType =
  | "INCOME"
  | "EXPENSE"
  | "TRANSFER";

export type CreateTransactionInput = {
  accountId: string;
  categoryId?: string;
  transferAccountId?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  merchant?: string;
  date?: string;
  notes?: string;
  isRecurring?: boolean;
};

export async function createTransaction(
  input: CreateTransactionInput
) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create transaction"
    );
  }

  return data.transaction;
}

export async function deleteTransaction(id: string) {
  const response = await fetch(
    `/api/transactions/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to delete transaction"
    );
  }

  return data;
}