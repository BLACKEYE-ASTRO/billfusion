"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type DashboardData = {
  summary: {
    totalBalance: number;
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  };

  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    currencySymbol: string;
    color: string | null;
    icon: string | null;
  }[];

  recentTransactions: {
    id: string;
    type: "INCOME" | "EXPENSE" | "TRANSFER";
    amount: number;
    description: string | null;
    merchant: string | null;
    date: string;
    category: {
      id: string;
      name: string;
      icon: string | null;
      color: string | null;
    } | null;
    account: {
      id: string;
      name: string;
    } | null;
  }[];

  spendingByCategory: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    amount: number;
    percentage: number;
  }[];

  budgets: {
    id: string;
    name: string;
    amount: number;
    totalLimit: number;
    totalSpent: number;
    remaining: number;
    percentage: number;
    categories: {
      id: string;
      categoryId: string;
      name: string;
      limit: number;
      spent: number;
      remaining: number;
      percentage: number;
    }[];
  }[];

  chartData: {
    month: string;
    income: number;
    expense: number;
  }[];
};

export function useDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/dashboard",
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load dashboard"
          );
        }

        setData(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch:
      fetchDashboard,
  };
}