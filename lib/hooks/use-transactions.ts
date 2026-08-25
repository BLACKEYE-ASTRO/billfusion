"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type Transaction = {
  id: string;

  type:
    | "INCOME"
    | "EXPENSE"
    | "TRANSFER";

  amount: string;

  description: string | null;
  merchant: string | null;

  date: string;

  notes: string | null;

  isRecurring: boolean;

  account: {
    id: string;
    name: string;
    type: string;
    currency: string;
    currencySymbol: string;
  };

  transferAccount: {
    id: string;
    name: string;
    type: string;
  } | null;

  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    isIncome: boolean;
  } | null;
};

type Filters = {
  type?: string;
  accountId?: string;
  categoryId?: string;
  search?: string;
  from?: string;
  to?: string;
};

export function useTransactions(
  filters: Filters = {}
) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchTransactions = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        Object.entries(filters).forEach(
          ([key, value]) => {
            if (value) {
              params.set(key, value);
            }
          }
        );

        const response = await fetch(
          `/api/transactions?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to fetch transactions"
          );
        }

        setTransactions(data.transactions);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      filters.type,
      filters.accountId,
      filters.categoryId,
      filters.search,
      filters.from,
      filters.to,
    ]
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
}