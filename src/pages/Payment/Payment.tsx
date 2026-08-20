"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grow,
  Fade,
  Zoom,
} from "@mui/material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentStatus = "pending" | "completed" | "cancelled" | "failed";

export interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  dueDate: string; // ISO date
  paidDate: string | null; // ISO date
}

// ---------------------------------------------------------------------------
// Mock data — swap this out for your real API call (e.g. React Query)
// ---------------------------------------------------------------------------

const NAMES = [
  "Dhamu", "Thaniga", "Dinesh", "Deva", "Suriya", "Prabhu", "Karthik", "Vijay", "Suresh", "Ravi"
];

const EMAILS = [
  "dhamu@gmail.com", "thaniga@gmail.com", "dinesh@gmail.com", "deva@gmail.com", 
  "suriya@gmail.com", "prabhu@gmail.com", "karthik@gmail.com", "vijay@gmail.com",
  "suresh@gmail.com", "ravi@gmail.com"
];

const METHODS = ["Card"];

function randomStatus(): PaymentStatus {
  const roll = Math.random();
  if (roll < 0.30) return "pending";
  if (roll < 0.60) return "completed";
  if (roll < 0.80) return "cancelled";
  return "failed";
}

function generateMockPayments(count: number): Payment[] {
  return Array.from({ length: count }, (_, i) => {
    const status = randomStatus();
    const name = NAMES[i % NAMES.length];
    const email = EMAILS[i % EMAILS.length];
    const due = new Date();
    due.setDate(due.getDate() + Math.floor(Math.random() * 30) - 15);
    const paid =
      status === "completed"
        ? new Date(due.getTime() - Math.floor(Math.random() * 5) * 86400000).toISOString()
        : null;

    return {
      id: `pay_${i + 1}`,
      userName: name,
      userEmail: email,
      amount: 1, // default amount for all users
      currency: "USD",
      status,
      method: METHODS[0],
      dueDate: due.toISOString(),
      paidDate: paid,
    };
  });
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface StatusConfigEntry {
  label: string;
  icon: string;
  color: string;
  bg: string;
  darkBg: string;
}

const STATUS_CONFIG: Record<PaymentStatus, StatusConfigEntry> = {
  pending: {
    label: "Pending",
    icon: "lucide:clock",
    color: "#b45309",
    bg: "#fef3c7",
    darkBg: "#3d2e00",
  },
  completed: {
    label: "Completed",
    icon: "lucide:check-circle-2",
    color: "#047857",
    bg: "#dcfce7",
    darkBg: "#14291e",
  },
  cancelled: {
    label: "Cancelled",
    icon: "lucide:x-circle",
    color: "#dc2626",
    bg: "#fee2e2",
    darkBg: "#7f1d1d",
  },
  failed: {
    label: "Failed",
    icon: "lucide:alert-circle",
    color: "#b91c1c",
    bg: "#fecaca",
    darkBg: "#991b1b",
  },
};

function getAvatarColor(name: string): string {
  const palette = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#14b8a6", "#ec4899"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function formatCurrency(amount: number, currency: string) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = STATUS_CONFIG[status];
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  
  return (
    <Zoom in timeout={500}>
      <Chip
        icon={
          <Icon
            icon={cfg.icon}
            style={{
              fontSize: 14,
              color: cfg.color,
            }}
          />
        }
        label={cfg.label}
        size="small"
        sx={{
          bgcolor: isDark ? cfg.darkBg : cfg.bg,
          color: cfg.color,
          fontWeight: 600,
          fontSize: 11.5,
          height: 24,
          borderRadius: "999px",
          "& .MuiChip-icon": { ml: "6px" },
          animation: "pulse-badge 2s ease-in-out infinite, glow-badge 3s ease-in-out infinite",
          "@keyframes pulse-badge": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
          },
          "@keyframes glow-badge": {
            "0%, 100%": { boxShadow: "0 0 5px rgba(99,102,241,0.1)" },
            "50%": { boxShadow: "0 0 20px rgba(99,102,241,0.2)" },
          },
        }}
      />
    </Zoom>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  return (
    <Grow in timeout={600}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark ? "#1a2744" : "#e2e8f0",
          borderRadius: "14px",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          height: "100%",
          bgcolor: isDark ? "#0F1828" : "#ffffff",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-6px) scale(1.03)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            borderColor: accent,
          },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${accent}15, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.6s ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${accent}, ${accent}80, ${accent})`,
            transform: "scaleX(0)",
            transition: "transform 0.6s ease",
            transformOrigin: "left",
          },
          "&:hover::after": {
            transform: "scaleX(1)",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: `${accent}1F`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.4s ease",
            animation: "float-icon 3s ease-in-out infinite",
            "@keyframes float-icon": {
              "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
              "25%": { transform: "translateY(-4px) rotate(-5deg)" },
              "75%": { transform: "translateY(4px) rotate(5deg)" },
            },
            "&:hover": {
              transform: "scale(1.2) rotate(10deg)",
            },
          }}
        >
          <Icon icon={icon} style={{ fontSize: 20, color: accent }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ 
            fontSize: 22, 
            fontWeight: 700, 
            color: isDark ? "#ffffff" : "#0f172a", 
            lineHeight: 1.1,
            transition: "color 0.3s ease",
            animation: "count-up 1s ease-out",
            "@keyframes count-up": {
              "0%": { transform: "scale(0.5)", opacity: 0 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}>
            {value}
          </Typography>
          <Typography sx={{ 
            fontSize: 12, 
            color: isDark ? "#9ca3af" : "#475569", 
            mt: 0.3,
            animation: "fade-in-text 0.8s ease-out",
            "@keyframes fade-in-text": {
              "0%": { opacity: 0, transform: "translateX(-10px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
          }}>
            {label}
          </Typography>
          {sub && (
            <Typography sx={{ 
              fontSize: 11, 
              color: isDark ? "#6b7280" : "#94a3b8", 
              mt: 0.2 
            }}>
              {sub}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
            animation: "pulse-ring 3s ease-in-out infinite",
            "@keyframes pulse-ring": {
              "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
              "50%": { transform: "scale(1.8)", opacity: 0 },
            },
          }}
        />
        {/* Animated shimmer overlay */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `linear-gradient(45deg, transparent 40%, ${accent}08 50%, transparent 60%)`,
            animation: "shimmer-card 4s ease-in-out infinite",
            "@keyframes shimmer-card": {
              "0%": { transform: "translateX(-100%) rotate(45deg)" },
              "100%": { transform: "translateX(100%) rotate(45deg)" },
            },
            pointerEvents: "none",
          }}
        />
      </Card>
    </Grow>
  );
}

type StatusFilter = "all" | "pending" | "completed" | "cancelled" | "failed";

function PaymentStatusContent() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [data] = useState<Payment[]>(() => generateMockPayments(10));
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "paidDate", desc: true }]);

  const statusFiltered = useMemo(
    () => (statusFilter === "all" ? data : data.filter((p) => p.status === statusFilter)),
    [data, statusFilter]
  );

  const summary = useMemo(() => {
    const pending = data.filter((p) => p.status === "pending");
    const completed = data.filter((p) => p.status === "completed");
    const cancelled = data.filter((p) => p.status === "cancelled");
    const failed = data.filter((p) => p.status === "failed");
    return {
      pendingCount: pending.length,
      pendingTotal: pending.reduce((sum, p) => sum + p.amount, 0),
      completedCount: completed.length,
      completedTotal: completed.reduce((sum, p) => sum + p.amount, 0),
      cancelledCount: cancelled.length,
      cancelledTotal: cancelled.reduce((sum, p) => sum + p.amount, 0),
      failedCount: failed.length,
      failedTotal: failed.reduce((sum, p) => sum + p.amount, 0),
      totalCount: data.length,
    };
  }, [data]);

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "user",
        accessorFn: (row) => `${row.userName} ${row.userEmail}`,
        header: "User",
        cell: ({ row }) => {
          const payment = row.original;
          const avatarColor = getAvatarColor(payment.userName);
          const initials = payment.userName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
              <Avatar 
                sx={{ 
                  bgcolor: avatarColor, 
                  width: 34, 
                  height: 34, 
                  fontWeight: 700, 
                  fontSize: 12,
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.3) rotate(15deg)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ 
                  fontSize: 13.5, 
                  fontWeight: 600, 
                  color: isDark ? "#ffffff" : "#0f172a",
                  transition: "color 0.3s ease",
                }}>
                  {payment.userName}
                </Typography>
                <Typography noWrap sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#9ca3af" : "#475569",
                  transition: "color 0.3s ease",
                }}>
                  {payment.userEmail}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <Typography sx={{ 
            fontSize: 13.5, 
            fontWeight: 600, 
            color: isDark ? "#ffffff" : "#0f172a",
            transition: "color 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              color: isDark ? "#6366f1" : "#6366f1",
            },
          }}>
            {formatCurrency(row.original.amount, row.original.currency)}
          </Typography>
        ),
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => (
          <Typography sx={{ 
            fontSize: 13, 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "color 0.3s ease",
          }}>
            {row.original.method}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, filterValue: StatusFilter) =>
          filterValue === "all" || row.getValue(columnId) === filterValue,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "paidDate",
        header: "Paid date",
        cell: ({ row }) => (
          <Typography sx={{ 
            fontSize: 13, 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "color 0.3s ease",
          }}>
            {formatDate(row.original.paidDate)}
          </Typography>
        ),
      },
    ],
    [isDark]
  );

  const table = useReactTable({
    data: statusFiltered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 9 } },
  });

  const gridRows = table.getRowModel().rows;

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: isDark ? "#0F1828" : "#f8fafc",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: -200,
        right: -200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)",
        animation: "float-bg 20s ease-in-out infinite",
        "@keyframes float-bg": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-50px, -30px) scale(1.2)" },
          "66%": { transform: "translate(50px, 20px) scale(0.8)" },
        },
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -200,
        left: -200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)",
        animation: "float-bg-reverse 25s ease-in-out infinite",
        "@keyframes float-bg-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(50px, 30px) scale(1.3)" },
          "66%": { transform: "translate(-50px, -20px) scale(0.7)" },
        },
      },
    }}>
      <Box sx={{ 
        maxWidth: 1440, 
        mx: "auto", 
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 3, md: 4 },
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: isDark ? "#ffffff" : "#0f172a",
            animation: "fade-in-down 0.8s ease-out, shimmer-text 3s ease-in-out infinite",
            "@keyframes fade-in-down": {
              "0%": { transform: "translateY(-30px) scale(0.9)", opacity: 0 },
              "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
            },
            "@keyframes shimmer-text": {
              "0%, 100%": { backgroundPosition: "200% center" },
              "50%": { backgroundPosition: "0% center" },
            },
            background: isDark ? "none" : "linear-gradient(90deg, #0f172a, #6366f1, #0f172a)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: isDark ? "none" : "text",
            WebkitTextFillColor: isDark ? "#ffffff" : "transparent",
          }}>
            Payments
          </Typography>
          <Typography sx={{ 
            fontSize: 13.5, 
            color: isDark ? "#9ca3af" : "#475569", 
            mt: 0.4,
            animation: "fade-in-up 0.8s ease-out",
            "@keyframes fade-in-up": {
              "0%": { transform: "translateY(20px)", opacity: 0 },
              "100%": { transform: "translateY(0)", opacity: 1 },
            },
          }}>
            Track pending, completed, cancelled, and failed payments across your users.
          </Typography>
        </Box>

        {/* Summary cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <SummaryCard
              icon="lucide:layers"
              label="Total payments"
              value={summary.totalCount.toString()}
              accent="#6366f1"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SummaryCard
              icon="lucide:clock"
              label="Pending"
              value={summary.pendingCount.toString()}
              sub={formatCurrency(summary.pendingTotal, "USD")}
              accent="#d97706"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SummaryCard
              icon="lucide:check-circle-2"
              label="Completed"
              value={summary.completedCount.toString()}
              sub={formatCurrency(summary.completedTotal, "USD")}
              accent="#16a34a"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SummaryCard
              icon="lucide:trending-up"
              label="Success rate"
              value={`${Math.round((summary.completedCount / summary.totalCount) * 100)}%`}
              accent="#0ea5e9"
            />
          </Grid>
        </Grid>

        {/* Toolbar */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", lg: "center" }}
          justifyContent="space-between"
          sx={{ 
            mb: 5,
            animation: "fade-in 0.6s ease-out",
            "@keyframes fade-in": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <TextField
            size="small"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by name or email..."
            sx={{
              width: { xs: "100%", lg: 480 },
              "& .MuiOutlinedInput-root": { 
                borderRadius: "10px", 
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                transition: "all 0.4s ease",
                "&:focus-within": {
                  transform: "scale(1.03)",
                  boxShadow: "0 8px 30px rgba(99,102,241,0.2)",
                },
                "& fieldset": {
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  transition: "border-color 0.3s ease",
                },
                "&:hover fieldset": {
                  borderColor: isDark ? "#2a3a5c" : "#94a3b8",
                },
              },
              "& .MuiInputBase-input": {
                color: isDark ? "#ffffff" : "#0f172a",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon 
                    icon="lucide:search" 
                    style={{ 
                      fontSize: 17, 
                      color: isDark ? "#6b7280" : "#94a3b8",
                    }} 
                  />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "10px",
              p: 0.5,
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              rowGap: 0.5,
            }}
          >
            {(["all", "pending", "completed", "cancelled", "failed"] as StatusFilter[]).map((s, index) => (
              <Grow in timeout={300 + index * 150} key={s}>
                <Chip
                  label={s.charAt(0).toUpperCase() + s.slice(1)}
                  onClick={() => setStatusFilter(s)}
                  size="small"
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: "8px",
                    bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : "transparent",
                    color: statusFilter === s ? (isDark ? "#0F1828" : "#ffffff") : (isDark ? "#9ca3af" : "#475569"),
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.08)",
                      bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#1a2744" : "#f1f5f9"),
                    },
                  }}
                />
              </Grow>
            ))}
          </Stack>
        </Stack>

        {/* Table of payments */}
        {gridRows.length === 0 ? (
          <Zoom in timeout={600}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                borderRadius: "14px",
                py: 6,
                textAlign: "center",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                animation: "fade-in 0.6s ease-out",
                "@keyframes fade-in": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              <Typography sx={{ 
                fontSize: 13.5, 
                color: isDark ? "#6b7280" : "#94a3b8" 
              }}>
                No payments match your search or filters.
              </Typography>
            </Card>
          </Zoom>
        ) : (
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "14px",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slide-up 0.6s ease-out",
              "@keyframes slide-up": {
                "0%": { transform: "translateY(40px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
            }}
          >
            <Table size="small">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isDark ? "#9ca3af" : "#475569",
                          borderColor: isDark ? "#1a2744" : "#e2e8f0",
                          whiteSpace: "nowrap",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: isDark ? "#ffffff" : "#0f172a",
                          },
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {gridRows.map((row, index) => (
                  <Fade in timeout={300 + index * 80} key={row.id}>
                    <TableRow
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { 
                          bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                          transform: "scale(1.02)",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          sx={{
                            borderColor: isDark ? "#1a2744" : "#e2e8f0",
                            py: 1.2,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ 
            pt: 3,
            animation: "fade-in-up 0.8s ease-out",
            "@keyframes fade-in-up": {
              "0%": { transform: "translateY(30px)", opacity: 0 },
              "100%": { transform: "translateY(0)", opacity: 1 },
            },
          }}
        >
          <Typography sx={{ 
            fontSize: 12, 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "color 0.3s ease",
          }}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)} · {table.getFilteredRowModel().rows.length} results
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="small"
              sx={{ 
                border: "1px solid", 
                borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                borderRadius: "8px",
                color: isDark ? "#ffffff" : "#0f172a",
                transition: "all 0.4s ease",
                "&:hover:not(:disabled)": {
                  transform: "scale(1.15) translateX(-4px)",
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                },
                "&:active:not(:disabled)": {
                  transform: "scale(0.9)",
                },
                "&.Mui-disabled": {
                  color: isDark ? "#6b7280" : "#94a3b8",
                }
              }}
            >
              <Icon icon="lucide:chevron-left" style={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="small"
              sx={{ 
                border: "1px solid", 
                borderColor: isDark ? "#1a2744" : "#e2e8f0", 
                borderRadius: "8px",
                color: isDark ? "#ffffff" : "#0f172a",
                transition: "all 0.4s ease",
                "&:hover:not(:disabled)": {
                  transform: "scale(1.15) translateX(4px)",
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                },
                "&:active:not(:disabled)": {
                  transform: "scale(0.9)",
                },
                "&.Mui-disabled": {
                  color: isDark ? "#6b7280" : "#94a3b8",
                }
              }}
            >
              <Icon icon="lucide:chevron-right" style={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PaymentStatusPage() {
  return <PaymentStatusContent />;
}