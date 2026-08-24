"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const transactions = [
  {
    name: "Salary",
    category: "Income",
    date: "Today, 10:42 AM",
    amount: "+₹52,400",
    type: "income",
  },
  {
    name: "Amazon",
    category: "Shopping",
    date: "Yesterday, 7:20 PM",
    amount: "-₹2,499",
    type: "expense",
  },
  {
    name: "Zomato",
    category: "Food",
    date: "Yesterday, 1:12 PM",
    amount: "-₹640",
    type: "expense",
  },
  {
    name: "Uber",
    category: "Transport",
    date: "Aug 21, 9:40 PM",
    amount: "-₹380",
    type: "expense",
  },
];

export default function RecentTransactions() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">

      <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">

        <div>
          <p className="text-sm font-medium">
            Recent transactions
          </p>

          <p className="mt-1 text-xs text-white/30">
            Your latest financial activity
          </p>
        </div>

        <button className="text-xs text-[#00A67E] hover:underline">
          View all
        </button>

      </div>

      <div className="divide-y divide-white/[0.05]">

        {transactions.map((transaction) => (

          <div
            key={transaction.name}
            className="flex items-center justify-between gap-4 p-5 transition hover:bg-white/[0.02]"
          >

            <div className="flex items-center gap-3">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  transaction.type === "income"
                    ? "bg-[#00A67E]/10"
                    : "bg-white/[0.05]"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowDownLeft
                    size={17}
                    className="text-[#00A67E]"
                  />
                ) : (
                  <ArrowUpRight
                    size={17}
                    className="text-white/50"
                  />
                )}
              </div>

              <div>

                <p className="text-sm font-medium">
                  {transaction.name}
                </p>

                <p className="mt-1 text-[11px] text-white/30">
                  {transaction.category} · {transaction.date}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span
                className={`text-sm font-medium ${
                  transaction.type === "income"
                    ? "text-[#00A67E]"
                    : "text-white"
                }`}
              >
                {transaction.amount}
              </span>

              <button className="text-white/20 hover:text-white">
                <MoreHorizontal size={17} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}