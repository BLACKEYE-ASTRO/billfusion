"use client";

import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Wallet,
  Tag,
  PiggyBank,
  Loader2,
  CheckCheck,
  CircleDollarSign,
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

import {
  UserButton,
  useUser,
} from "@clerk/nextjs";

import Link from "next/link";

import { IoFastFood } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import {
  FaCar,
  FaShoppingBasket,
} from "react-icons/fa";

/* ============================================================
   TYPES
============================================================ */

interface SearchTransaction {
  id: string;
  description: string | null;
  merchant: string | null;
  amount: string | number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  date: string;

  account: {
    name: string;
  };

  category: {
    name: string;
  } | null;
}

interface SearchAccount {
  id: string;
  name: string;
  type: string;
  balance: string | number;
  currencySymbol: string;
}

interface SearchCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isIncome: boolean;
}

interface SearchBudget {
  id: string;
  name: string;
  amount: string | number;
  period: string;
  startDate: string;
  endDate: string;
}

interface SearchResults {
  transactions: SearchTransaction[];
  accounts: SearchAccount[];
  categories: SearchCategory[];
  budgets: SearchBudget[];
}

interface Notification {
  id: string;
  title: string;
  message: string;

  type:
  | "transaction"
  | "budget"
  | "goal"
  | "system";

  createdAt: string;

  isRead: boolean;
}

/* ============================================================
   MAIN HEADER
============================================================ */

export default function DashboardHeader() {
  const {
    isLoaded,
    isSignedIn,
    user,
  } = useUser();

  /* ----------------------------------------------------------
     DATE
  ---------------------------------------------------------- */

  const [date, setDate] = useState("");
  const [greeting, setGreeting] = useState("");

  /* ----------------------------------------------------------
     SEARCH
  ---------------------------------------------------------- */

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] =
    useState<SearchResults>({
      transactions: [],
      accounts: [],
      categories: [],
      budgets: [],
    });

  const [searchLoading, setSearchLoading] =
    useState(false);

  const searchTimeout = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  /* ----------------------------------------------------------
     NOTIFICATIONS
  ---------------------------------------------------------- */

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationLoading,
    setNotificationLoading,
  ] = useState(false);

  const [
    markingRead,
    setMarkingRead,
  ] = useState(false);

  /* ==========================================================
     DATE + GREETING
  ========================================================== */

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );

      const hour = now.getHours();

      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 17) {
        setGreeting("Good afternoon");
      } else if (hour < 21) {
        setGreeting("Good evening");
      } else {
        setGreeting("Good night");
      }
    };

    updateDateTime();

    const interval = setInterval(
      updateDateTime,
      60_000
    );

    return () => clearInterval(interval);
  }, []);

  /* ==========================================================
     KEYBOARD SHORTCUTS
  ========================================================== */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (
        event.key === "/" &&
        !isTyping
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
        setSearch("");
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* ==========================================================
     LOAD NOTIFICATIONS
  ========================================================== */

  const loadNotifications = async () => {
    try {
      setNotificationLoading(true);

      const response = await fetch(
        "/api/notifications",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to load notifications"
        );
      }

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );

      setUnreadCount(
        Number(data.unreadCount) || 0
      );
    } catch (error) {
      console.error(
        "Notification error:",
        error
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  /* ==========================================================
     INITIAL NOTIFICATION LOAD
  ========================================================== */

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    loadNotifications();
  }, [isLoaded, isSignedIn]);
  /* ==========================================================
     MARK ALL NOTIFICATIONS READ
  ========================================================== */

  const markAllNotificationsRead =
    async () => {
      try {
        if (unreadCount === 0) {
          return;
        }

        setMarkingRead(true);

        const response = await fetch(
          "/api/notifications",
          {
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to mark notifications as read"
          );
        }

        setNotifications((previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Mark notifications read error:",
          error
        );
      } finally {
        setMarkingRead(false);
      }
    };

  /* ==========================================================
     SEARCH
  ========================================================== */

  const performSearch = (
    value: string
  ) => {
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!value.trim()) {
      setSearchResults({
        transactions: [],
        accounts: [],
        categories: [],
        budgets: [],
      });

      return;
    }

    searchTimeout.current =
      setTimeout(async () => {
        try {
          setSearchLoading(true);

          const response = await fetch(
            `/api/search?q=${encodeURIComponent(
              value.trim()
            )}`,
            {
              cache: "no-store",
            }
          );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
              "Search failed"
            );
          }

          setSearchResults({
            transactions:
              data.transactions || [],
            accounts:
              data.accounts || [],
            categories:
              data.categories || [],
            budgets:
              data.budgets || [],
          });
        } catch (error) {
          console.error(
            "Search error:",
            error
          );
        } finally {
          setSearchLoading(false);
        }
      }, 350);
  };

  /* ==========================================================
     CLOSE SEARCH
  ========================================================== */

  const closeSearch = () => {
    setSearchOpen(false);

    setSearch("");

    setSearchResults({
      transactions: [],
      accounts: [],
      categories: [],
      budgets: [],
    });
  };

  /* ==========================================================
     USER
  ========================================================== */

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  /* ==========================================================
     SEARCH COUNT
  ========================================================== */

  const totalResults =
    searchResults.transactions.length +
    searchResults.accounts.length +
    searchResults.categories.length +
    searchResults.budgets.length;

  /* ==========================================================
     NOTIFICATION ICON
  ========================================================== */

  const notificationIcon = (
    type: Notification["type"]
  ) => {
    switch (type) {
      case "transaction":
        return (
          <ArrowDownRight size={15} />
        );

      case "budget":
        return (
          <PiggyBank size={15} />
        );

      case "goal":
        return (
          <Wallet size={15} />
        );

      default:
        return <Bell size={15} />;
    }
  };

  /* ==========================================================
     TIME AGO
  ========================================================== */

  const timeAgo = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    const now = new Date();

    const diff =
      now.getTime() -
      date.getTime();

    const seconds =
      Math.floor(diff / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-30
          border-b
          border-white/[0.06]
          bg-[#050706]/80
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            h-[76px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* LEFT */}

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-white/25
                sm:text-xs
                sm:normal-case
                sm:tracking-normal
              "
            >
              {date}
            </p>

            <h1
              className="
                mt-1
                truncate
                text-base
                font-semibold
                tracking-tight
                sm:text-lg
              "
            >
              {greeting}

              {isLoaded &&
                isSignedIn ? (
                <>
                  {", "}

                  <span className="text-white">
                    {firstName}
                  </span>
                </>
              ) : null}

              <span className="ml-1">
                👋
              </span>
            </h1>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            {/* DESKTOP SEARCH */}

            <button
              onClick={() =>
                setSearchOpen(true)
              }
              className="
                hidden
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-3
                text-xs
                text-white/35
                transition
                hover:border-white/[0.12]
                hover:bg-white/[0.05]
                hover:text-white/60
                sm:flex
              "
            >
              <Search size={15} />

              <span>
                Search
              </span>

              <kbd
                className="
                  ml-2
                  rounded-md
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  px-1.5
                  py-0.5
                  text-[9px]
                  text-white/20
                "
              >
                /
              </kbd>
            </button>

            {/* MOBILE SEARCH */}

            <button
              onClick={() =>
                setSearchOpen(true)
              }
              aria-label="Search"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                text-white/45
                transition
                hover:bg-white/[0.05]
                hover:text-white
                sm:hidden
              "
            >
              <Search size={17} />
            </button>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="relative">
              <button
                onClick={() => {
                  const next =
                    !notificationOpen;

                  setNotificationOpen(
                    next
                  );

                  if (next) {
                    loadNotifications();
                  }
                }}
                aria-label="Notifications"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-white/50
                  transition
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <Bell size={17} />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      right-1
                      top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#00A67E]
                      px-1
                      text-[8px]
                      font-bold
                      text-black
                    "
                  >
                    {unreadCount >
                      9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                    }}
                    className="
                      absolute
                      right-0
                      top-12
                      z-[100]
                      w-[340px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#0a0d0b]
                      shadow-2xl
                    "
                  >
                    {/* DROPDOWN HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/[0.06]
                        px-4
                        py-3
                      "
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          Notifications
                        </p>

                        <p className="mt-0.5 text-[10px] text-white/25">
                          {unreadCount}{" "}
                          unread
                        </p>
                      </div>

                      {unreadCount >
                        0 && (
                          <button
                            disabled={
                              markingRead
                            }
                            onClick={
                              markAllNotificationsRead
                            }
                            className="
                            flex
                            items-center
                            gap-1
                            text-[10px]
                            text-[#00A67E]
                            transition
                            hover:text-[#00c895]
                            disabled:opacity-50
                          "
                          >
                            {markingRead ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCheck
                                size={13}
                              />
                            )}

                            Mark read
                          </button>
                        )}
                    </div>

                    {/* BODY */}

                    <div className="max-h-[400px] overflow-y-auto">
                      {notificationLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2
                            size={20}
                            className="
                              animate-spin
                              text-[#00A67E]
                            "
                          />
                        </div>
                      ) : notifications.length ===
                        0 ? (
                        <div className="px-5 py-12 text-center">
                          <div
                            className="
                              mx-auto
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-white/[0.04]
                              text-white/20
                            "
                          >
                            <Bell
                              size={18}
                            />
                          </div>

                          <p className="mt-3 text-sm text-white/50">
                            You're all
                            caught up
                          </p>

                          <p className="mt-1 text-[10px] text-white/20">
                            No new
                            notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map(
                          (
                            notification
                          ) => (
                            <div
                              key={
                                notification.id
                              }
                              className={`
                                flex
                                gap-3
                                border-b
                                border-white/[0.04]
                                px-4
                                py-3
                                transition
                                hover:bg-white/[0.025]
                                ${!notification.isRead
                                  ? "bg-[#00A67E]/[0.025]"
                                  : ""
                                }
                              `}
                            >
                              {/* ICON */}

                              <div
                                className="
                                  relative
                                  mt-0.5
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#00A67E]/10
                                  text-[#00A67E]
                                "
                              >
                                {notificationIcon(
                                  notification.type
                                )}

                                {!notification.isRead && (
                                  <span
                                    className="
                                      absolute
                                      -right-0.5
                                      -top-0.5
                                      h-2
                                      w-2
                                      rounded-full
                                      bg-[#00A67E]
                                    "
                                  />
                                )}
                              </div>

                              {/* CONTENT */}

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`
                                    text-xs
                                    ${notification.isRead
                                      ? "font-medium text-white/60"
                                      : "font-semibold text-white"
                                    }
                                  `}
                                >
                                  {
                                    notification.title
                                  }
                                </p>

                                <p className="mt-1 text-[10px] leading-relaxed text-white/35">
                                  {
                                    notification.message
                                  }
                                </p>

                                <p className="mt-1.5 text-[9px] text-white/20">
                                  {timeAgo(
                                    notification.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>

                    {/* FOOTER */}

                    <div className="border-t border-white/[0.06] p-2">
                      <Link
                        href="/dashboard/transactions"
                        onClick={() =>
                          setNotificationOpen(
                            false
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          rounded-lg
                          py-2
                          text-[10px]
                          text-white/30
                          transition
                          hover:bg-white/[0.04]
                          hover:text-white
                        "
                      >
                        View transactions
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* USER */}

            <div className="lg:hidden">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          SEARCH OVERLAY
      ===================================================== */}

      <AnimatePresence>
        {searchOpen && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeSearch}
              className="
                fixed
                inset-0
                z-[80]
                bg-black/70
                backdrop-blur-sm
              "
            />

            {/* SEARCH MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.97,
              }}
              className="
                fixed
                left-1/2
                top-20
                z-[90]
                w-[calc(100%-2rem)]
                max-w-xl
                -translate-x-1/2
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-[#0a0d0b]
                shadow-2xl
              "
            >
              {/* SEARCH INPUT */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-white/[0.06]
                  px-4
                "
              >
                <Search
                  size={18}
                  className="shrink-0 text-white/30"
                />

                <input
                  autoFocus
                  value={search}
                  onChange={(event) =>
                    performSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search transactions, accounts, budgets..."
                  className="
                    h-14
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                  "
                />

                {searchLoading && (
                  <Loader2
                    size={16}
                    className="
                      animate-spin
                      text-[#00A67E]
                    "
                  />
                )}

                <button
                  onClick={closeSearch}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-white/30
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <X size={16} />
                </button>
              </div>

              {/* RESULTS */}

              <div className="max-h-[500px] overflow-y-auto p-3">
                {!search.trim() ? (
                  <QuickSearch
                    onSelect={(value) =>
                      performSearch(
                        value
                      )
                    }
                  />
                ) : searchLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2
                      size={22}
                      className="
                        animate-spin
                        text-[#00A67E]
                      "
                    />

                    <p className="mt-3 text-xs text-white/25">
                      Searching your
                      finances...
                    </p>
                  </div>
                ) : totalResults ===
                  0 ? (
                  <div className="py-12 text-center">
                    <Search
                      size={24}
                      className="mx-auto text-white/15"
                    />

                    <p className="mt-3 text-sm text-white/40">
                      No results
                      found
                    </p>

                    <p className="mt-1 text-[10px] text-white/20">
                      Try another
                      transaction,
                      account or
                      budget name.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* TRANSACTIONS */}

                    {searchResults
                      .transactions
                      .length >
                      0 && (
                        <SearchSection title="Transactions">
                          {searchResults.transactions.map(
                            (
                              transaction
                            ) => (
                              <Link
                                key={
                                  transaction.id
                                }
                                href="/dashboard/transactions"
                                onClick={
                                  closeSearch
                                }
                                className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                transition
                                hover:bg-white/[0.04]
                              "
                              >
                                <div
                                  className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-white/[0.04]
                                "
                                >
                                  {transaction.type ===
                                    "INCOME" ? (
                                    <ArrowUpRight
                                      size={
                                        16
                                      }
                                      className="text-[#00A67E]"
                                    />
                                  ) : transaction.type ===
                                    "TRANSFER" ? (
                                    <ArrowLeftRight
                                      size={
                                        16
                                      }
                                      className="text-blue-400"
                                    />
                                  ) : (
                                    <ArrowDownRight
                                      size={
                                        16
                                      }
                                      className="text-red-400"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium text-white">
                                    {transaction.merchant ||
                                      transaction.description ||
                                      "Transaction"}
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] text-white/25">
                                    {transaction.category?.name ||
                                      "Uncategorized"}{" "}
                                    •{" "}
                                    {transaction.account.name}
                                  </p>
                                </div>

                                <span
                                  className={`
                                  text-xs
                                  font-medium
                                  ${transaction.type ===
                                      "INCOME"
                                      ? "text-[#00A67E]"
                                      : transaction.type ===
                                        "TRANSFER"
                                        ? "text-blue-400"
                                        : "text-white/60"
                                    }
                                `}
                                >
                                  {transaction.type ===
                                    "INCOME"
                                    ? "+"
                                    : transaction.type ===
                                      "TRANSFER"
                                      ? ""
                                      : "-"}
                                  {Number(
                                    transaction.amount
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </Link>
                            )
                          )}
                        </SearchSection>
                      )}

                    {/* ACCOUNTS */}

                    {searchResults
                      .accounts.length >
                      0 && (
                        <SearchSection title="Accounts">
                          {searchResults.accounts.map(
                            (account) => (
                              <Link
                                key={
                                  account.id
                                }
                                href="/dashboard"
                                onClick={
                                  closeSearch
                                }
                                className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                transition
                                hover:bg-white/[0.04]
                              "
                              >
                                <div
                                  className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#00A67E]/10
                                  text-[#00A67E]
                                "
                                >
                                  <Wallet
                                    size={
                                      16
                                    }
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-white">
                                    {
                                      account.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-white/25">
                                    {
                                      account.type
                                    }
                                  </p>
                                </div>

                                <span className="text-xs text-white/50">
                                  {
                                    account.currencySymbol
                                  }
                                  {Number(
                                    account.balance
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </Link>
                            )
                          )}
                        </SearchSection>
                      )}

                    {/* CATEGORIES */}

                    {searchResults
                      .categories.length >
                      0 && (
                        <SearchSection title="Categories">
                          {searchResults.categories.map(
                            (category) => (
                              <Link
                                key={
                                  category.id
                                }
                                href="/dashboard/transactions"
                                onClick={
                                  closeSearch
                                }
                                className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                transition
                                hover:bg-white/[0.04]
                              "
                              >
                                <div
                                  className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-white/[0.04]
                                "
                                >
                                  <Tag
                                    size={
                                      16
                                    }
                                    className="text-white/40"
                                  />
                                </div>

                                <div>
                                  <p className="text-xs font-medium text-white">
                                    {
                                      category.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-white/25">
                                    {category.isIncome
                                      ? "Income"
                                      : "Expense"}
                                  </p>
                                </div>
                              </Link>
                            )
                          )}
                        </SearchSection>
                      )}

                    {/* BUDGETS */}

                    {searchResults
                      .budgets.length >
                      0 && (
                        <SearchSection title="Budgets">
                          {searchResults.budgets.map(
                            (budget) => (
                              <Link
                                key={
                                  budget.id
                                }
                                href="/dashboard/budgets"
                                onClick={
                                  closeSearch
                                }
                                className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                transition
                                hover:bg-white/[0.04]
                              "
                              >
                                <div
                                  className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#00A67E]/10
                                  text-[#00A67E]
                                "
                                >
                                  <PiggyBank
                                    size={
                                      16
                                    }
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-white">
                                    {
                                      budget.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-white/25">
                                    {
                                      budget.period
                                    }
                                  </p>
                                </div>

                                <span className="text-xs text-white/50">
                                  {Number(
                                    budget.amount
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </Link>
                            )
                          )}
                        </SearchSection>
                      )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   SEARCH SECTION
============================================================ */

function SearchSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p
        className="
          mb-1
          px-3
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-white/20
        "
      >
        {title}
      </p>

      <div>{children}</div>
    </section>
  );
}

/* ============================================================
   QUICK SEARCH
============================================================ */

function QuickSearch({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const shortcuts = [
    {
      label: "Food",
      value: "food",
      icon: IoFastFood,
    },
    {
      label: "Travel",
      value: "travel",
      icon: FaCar,
    },
    {
      label: "Clothes",
      value: "clothes",
      icon: GiClothes,
    },
    {
      label: "Grocery",
      value: "grocery",
      icon: FaShoppingBasket,
    },
  ];

  return (
    <div className="p-1">
      <p
        className="
          px-3
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-white/20
        "
      >
        Quick search
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {shortcuts.map(
          (shortcut) => {
            const Icon =
              shortcut.icon;

            return (
              <button
                key={
                  shortcut.value
                }
                onClick={() =>
                  onSelect(
                    shortcut.value
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                  px-3
                  py-3
                  text-left
                  text-xs
                  text-white/40
                  transition
                  hover:border-white/[0.1]
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <Icon size={14} />

                {shortcut.label}
              </button>
            );
          }
        )}
      </div>

      <p className="mt-4 px-3 text-[10px] text-white/15">
        Search your transactions,
        accounts, categories and
        budgets.
      </p>
    </div>
  );
}