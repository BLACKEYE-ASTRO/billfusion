"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type Account = {
  id: string;
  name: string;
  type: string;
  balance: string;
  currency: string;
  currencySymbol: string;
};

export function useAccounts() {
  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchAccounts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/accounts"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to fetch accounts"
          );
        }

        setAccounts(data.accounts ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch accounts"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
  };
}