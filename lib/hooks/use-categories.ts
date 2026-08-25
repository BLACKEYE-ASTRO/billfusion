"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isIncome: boolean;
};

export function useCategories() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchCategories =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/categories"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to fetch categories"
          );
        }

        setCategories(data.categories);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}