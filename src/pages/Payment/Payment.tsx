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
} from "@mui/material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentStatus = "pending" | "completed" | "processing";

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
  "Ariana Cole", "Marcus Lee", "Priya Nair", "Diego Fernandez", "Hannah Kim",
  "Oliver Grant", "Fatima Al-Sayed", "Noah Becker", "Sophia Rossi", "Liam Turner",
  "Meera Iyer", "Ethan Brooks", "Zara Ahmed", "Lucas Silva", "Isla Watson",
];

const METHODS = ["Card", "UPI", "Bank transfer", "Wallet"];

function randomStatus(): PaymentStatus {
  const roll = Math.random();
  if (roll < 0.35) return "pending";
  if (roll < 0.7) return "completed";
  return "processing";
}

function generateMockPayments(count: number): Payment[] {
  return Array.from({ length: count }, (_, i) => {
    const status = randomStatus();
    const name = NAMES[i % NAMES.length];
    const due = new Date();
    due.setDate(due.getDate() + Math.floor(Math.random() * 30) - 15);
    const paid =
      status === "completed"
        ? new Date(due.getTime() - Math.floor(Math.random() * 5) * 86400000).toISOString()
        : null;

    return {
      id: `pay_${i + 1}`,
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      amount: 1, // default amount for all users
      currency: "USD",
      status,
      method: METHODS[i % METHODS.length],
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
  processing: {
    label: "Processing",
    icon: "lucide:loader-2",
    color: "#1d4ed8",
    bg: "#dbeafe",
    darkBg: "#1e3a5f",
  },
  completed: {
    label: "Completed",
    icon: "lucide:check-circle-2",
    color: "#047857",
    bg: "#dcfce7",
    darkBg: "#14291e",
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
    <Chip
      icon={
        <Icon
          icon={cfg.icon}
          style={{
            fontSize: 14,
            color: cfg.color,
            animation: status === "processing" ? "spin 1s linear infinite" : undefined,
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
        "@keyframes spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
      }}
    />
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
        }}
      >
        <Icon icon={icon} style={{ fontSize: 20, color: accent }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ 
          fontSize: 22, 
          fontWeight: 700, 
          color: isDark ? "#ffffff" : "#0f172a", 
          lineHeight: 1.1 
        }}>
          {value}
        </Typography>
        <Typography sx={{ 
          fontSize: 12, 
          color: isDark ? "#9ca3af" : "#475569", 
          mt: 0.3 
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
    </Card>
  );
}

type StatusFilter = "all" | PaymentStatus;

function PaymentStatusContent() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [data] = useState<Payment[]>(() => generateMockPayments(100));
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
    return {
      pendingCount: pending.length,
      pendingTotal: pending.reduce((sum, p) => sum + p.amount, 0),
      completedCount: completed.length,
      completedTotal: completed.reduce((sum, p) => sum + p.amount, 0),
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
              <Avatar sx={{ bgcolor: avatarColor, width: 34, height: 34, fontWeight: 700, fontSize: 12 }}>
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ 
                  fontSize: 13.5, 
                  fontWeight: 600, 
                  color: isDark ? "#ffffff" : "#0f172a" 
                }}>
                  {payment.userName}
                </Typography>
                <Typography noWrap sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#9ca3af" : "#475569" 
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
            color: isDark ? "#ffffff" : "#0f172a" 
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
            color: isDark ? "#9ca3af" : "#475569" 
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
            color: isDark ? "#9ca3af" : "#475569" 
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
      bgcolor: isDark ? "#0F1828" : "#f8fafc" 
    }}>
      <Box sx={{ 
        maxWidth: 1440, 
        mx: "auto", 
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 3, md: 4 } 
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: isDark ? "#ffffff" : "#0f172a" 
          }}>
            Payments
          </Typography>
          <Typography sx={{ 
            fontSize: 13.5, 
            color: isDark ? "#9ca3af" : "#475569", 
            mt: 0.4 
          }}>
            Track pending, processing, and completed payments across your users.
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
          sx={{ mb: 5 }}
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
                "& fieldset": {
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
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
                  <Icon icon="lucide:search" style={{ fontSize: 17, color: isDark ? "#6b7280" : "#94a3b8" }} />
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
            {(["all", "pending", "processing", "completed"] as StatusFilter[]).map((s) => (
              <Chip
                key={s}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
                onClick={() => setStatusFilter(s)}
                size="small"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: "8px",
                  bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : "transparent",
                  color: statusFilter === s ? (isDark ? "#0F1828" : "#ffffff") : (isDark ? "#9ca3af" : "#475569"),
                  "&:hover": {
                    bgcolor: statusFilter === s ? (isDark ? "#ffffff" : "#0f172a") : (isDark ? "#1a2744" : "#f1f5f9"),
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Table of payments */}
        {gridRows.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "14px",
              py: 6,
              textAlign: "center",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
            }}
          >
            <Typography sx={{ 
              fontSize: 13.5, 
              color: isDark ? "#6b7280" : "#94a3b8" 
            }}>
              No payments match your search or filters.
            </Typography>
          </Card>
        ) : (
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "14px",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
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
                {gridRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": { 
                        bgcolor: isDark ? "#1a2744" : "#f1f5f9" 
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 3 }}>
          <Typography sx={{ 
            fontSize: 12, 
            color: isDark ? "#9ca3af" : "#475569" 
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