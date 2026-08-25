export async function createBudget(
  data: {
    name: string;
    amount: number;
    period: "MONTHLY" | "YEARLY";

    startDate: string;
    endDate: string;

    categories: {
      categoryId: string;
      limit: number;
    }[];
  }
) {
  const response =
    await fetch(
      "/api/budgets",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Failed to create budget"
    );
  }

  return result.budget;
}

export async function deleteBudget(
  id: string
) {
  const response =
    await fetch(
      `/api/budgets/${id}`,
      {
        method: "DELETE",
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Failed to delete budget"
    );
  }

  return result;
}