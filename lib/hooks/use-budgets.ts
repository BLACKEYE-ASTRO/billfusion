"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type BudgetCategory = {
  id: string;
  categoryId: string;

  name: string;

  icon: string | null;
  color: string | null;

  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
};

export type Budget = {
  id: string;

  name: string;

  amount: number;

  period: "MONTHLY" | "YEARLY";

  startDate: string;
  endDate: string;

  totalLimit: number;
  totalSpent: number;
  remaining: number;
  percentage: number;

  categories: BudgetCategory[];
};

export function useBudgets() {
  const [budgets, setBudgets] =
    useState<Budget[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchBudgets =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/budgets",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to fetch budgets"
          );
        }

        setBudgets(
          data.budgets || []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch budgets"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
  };
}