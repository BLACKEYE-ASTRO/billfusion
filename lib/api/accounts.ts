export type CreateAccountInput = {
  name: string;
  type:
    | "CASH"
    | "BANK"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "WALLET"
    | "INVESTMENT"
    | "LOAN"
    | "OTHER";
  balance: number;
  color?: string;
  icon?: string;
};

export async function createAccount(
  input: CreateAccountInput
) {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create account"
    );
  }

  return data.account;
}