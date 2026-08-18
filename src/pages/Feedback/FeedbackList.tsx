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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeedbackStatus = "open" | "closed";

export interface FeedbackItem {
  id: string;
  userName: string;
  userEmail: string;
  message: string;
  status: FeedbackStatus;
  timestamp: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  message: string;
  timestamp: string;
  repliedBy: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const NAMES = [
  "Ariana Cole", "Marcus Lee", "Priya Nair", "Diego Fernandez", "Hannah Kim",
  "Oliver Grant", "Fatima Al-Sayed", "Noah Becker", "Sophia Rossi", "Liam Turner",
  "Meera Iyer", "Ethan Brooks", "Zara Ahmed", "Lucas Silva", "Isla Watson",
];

const FEEDBACK_MESSAGES = [
  "Excellent service! The team went above and beyond.",
  "Good product but delivery was delayed.",
  "Great quality and fast shipping. Will order again.",
  "The product arrived damaged. Requesting replacement.",
  "Absolutely amazing! Highly recommended!",
  "Average experience. Could be better.",
  "Outstanding customer support! Very helpful.",
  "Product quality is good but packaging needs improvement.",
  "Very satisfied with the purchase. Will buy again.",
  "Not happy with the service. Needs improvement.",
  "Best product I've ever bought!",
  "Quick delivery and great quality. Thank you!",
  "The team was very professional and responsive.",
  "Good value for money. Would recommend.",
  "Excellent experience from start to finish.",
];

function randomStatus(): FeedbackStatus {
  return Math.random() < 0.5 ? "open" : "closed";
}

function generateMockFeedbacks(count: number): FeedbackItem[] {
  return Array.from({ length: count }, (_, i) => {
    const status = randomStatus();
    const name = NAMES[i % NAMES.length];
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
    
    const replyCount = status === "closed" ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);
    const replies: Reply[] = Array.from({ length: replyCount }, (_, j) => ({
      id: `reply_${i}_${j}`,
      message: `Thank you for your feedback! We appreciate your input. ${j > 0 ? 'We will work on improving.' : ''}`,
      timestamp: new Date(timestamp.getTime() + 3600000 * (j + 1)).toISOString(),
      repliedBy: "Support Team",
    }));

    return {
      id: `fb_${i + 1}`,
      userName: name,
      userEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      message: FEEDBACK_MESSAGES[i % FEEDBACK_MESSAGES.length],
      status,
      timestamp: timestamp.toISOString(),
      replies,
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

const STATUS_CONFIG: Record<FeedbackStatus, StatusConfigEntry> = {
  open: {
    label: "Open",
    icon: "lucide:clock",
    color: "#b45309",
    bg: "#fef3c7",
    darkBg: "#3d2e00",
  },
  closed: {
    label: "Closed",
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

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: FeedbackStatus }) {
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

// Reply Dialog Component
function ReplyDialog({
  open,
  onClose,
  onSubmit,
  feedback,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reply: string) => void;
  feedback: FeedbackItem | null;
}) {
  const [replyText, setReplyText] = useState("");
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const handleSubmit = () => {
    if (replyText.trim()) {
      onSubmit(replyText);
      setReplyText("");
      onClose();
    }
  };

  if (!feedback) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          bgcolor: isDark ? "#0F1828" : "#ffffff",
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {feedback.userName.charAt(0)}
          </Avatar>
          <Box>
            <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a" }}>
              Reply to {feedback.userName}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
              {feedback.userEmail}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
      <DialogContent sx={{ mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Original Message:
          </Typography>
          <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a" }}>
            {feedback.message}
          </Typography>
        </Paper>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
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
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!replyText.trim()}
          endIcon={<Icon icon="lucide:send" />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Send Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// View Feedback Dialog
function ViewFeedbackDialog({
  open,
  onClose,
  feedback,
  onReply,
  onStatusChange,
}: {
  open: boolean;
  onClose: () => void;
  feedback: FeedbackItem | null;
  onReply: (feedbackId: string, replyMessage: string) => void;
  onStatusChange: (feedbackId: string, newStatus: FeedbackStatus) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";

  const handleReply = () => {
    if (replyText.trim() && feedback) {
      onReply(feedback.id, replyText);
      setReplyText("");
    }
  };

  const handleStatusToggle = () => {
    if (feedback) {
      const newStatus = feedback.status === "open" ? "closed" : "open";
      onStatusChange(feedback.id, newStatus);
    }
  };

  if (!feedback) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          bgcolor: isDark ? "#0F1828" : "#ffffff",
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {feedback.userName.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                {feedback.userName}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
                {feedback.userEmail}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusBadge status={feedback.status} />
            <Tooltip title={feedback.status === "open" ? "Close Feedback" : "Reopen Feedback"}>
              <IconButton
                onClick={handleStatusToggle}
                size="small"
                sx={{
                  color: feedback.status === "open" ? "#16a34a" : "#d97706",
                  "&:hover": {
                    bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.1)" : "rgba(217,119,6,0.1)",
                  },
                }}
              >
                <Icon 
                  icon={feedback.status === "open" ? "lucide:check-circle" : "lucide:clock"} 
                  style={{ fontSize: 20 }} 
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0" }} />
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Message
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: 2,
            }}
          >
            <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a" }}>
              {feedback.message}
            </Typography>
          </Paper>
        </Box>

        {feedback.replies.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
              Replies ({feedback.replies.length})
            </Typography>
            <Stack spacing={1}>
              {feedback.replies.map((reply) => (
                <Paper
                  key={reply.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: isDark ? "rgba(25,118,210,0.1)" : "rgba(25,118,210,0.05)",
                    borderRadius: 2,
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" color="primary">
                      {reply.repliedBy}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
                      {formatDate(reply.timestamp)}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                    {reply.message}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Add Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
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
          />
          <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              size="small"
              endIcon={<Icon icon="lucide:send" />}
              onClick={handleReply}
              disabled={!replyText.trim()}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Send Reply
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type StatusFilter = "all" | FeedbackStatus;

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function FeedbackContent() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<FeedbackItem[]>(() => generateMockFeedbacks(100));
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const statusFiltered = useMemo(
    () => (statusFilter === "all" ? data : data.filter((f) => f.status === statusFilter)),
    [data, statusFilter]
  );

  const summary = useMemo(() => {
    const open = data.filter((f) => f.status === "open");
    const closed = data.filter((f) => f.status === "closed");
    return {
      openCount: open.length,
      closedCount: closed.length,
      totalCount: data.length,
    };
  }, [data]);

  const handleReply = (feedbackId: string, replyMessage: string): void => {
    setData((prevData) =>
      prevData.map((feedback) => {
        if (feedback.id === feedbackId) {
          const newReply: Reply = {
            id: `reply_${Date.now()}`,
            message: replyMessage,
            timestamp: new Date().toISOString(),
            repliedBy: "Support Team",
          };
          return {
            ...feedback,
            replies: [...feedback.replies, newReply],
            status: feedback.status === "closed" ? "open" : feedback.status,
          };
        }
        return feedback;
      })
    );
    setSnackbar({
      open: true,
      message: "Reply sent successfully!",
      severity: "success",
    });
  };

  const handleStatusChange = (feedbackId: string, newStatus: FeedbackStatus): void => {
    setData((prevData) =>
      prevData.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, status: newStatus } : feedback
      )
    );
    setSnackbar({
      open: true,
      message: `Feedback ${newStatus === "open" ? "reopened" : "closed"} successfully!`,
      severity: "success",
    });
  };

  const handleOpenReplyDialog = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setReplyDialogOpen(true);
  };

  const handleOpenViewDialog = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleReplySubmit = (replyMessage: string) => {
    if (selectedFeedback) {
      handleReply(selectedFeedback.id, replyMessage);
    }
  };

  const columns = useMemo<ColumnDef<FeedbackItem>[]>(
    () => [
      {
        id: "user",
        accessorFn: (row) => `${row.userName} ${row.userEmail}`,
        header: "Customer",
        cell: ({ row }) => {
          const feedback = row.original;
          const avatarColor = getAvatarColor(feedback.userName);
          const initials = feedback.userName
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
                  {feedback.userName}
                </Typography>
                <Typography noWrap sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#9ca3af" : "#475569" 
                }}>
                  {feedback.userEmail}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "message",
        header: "Feedback",
        cell: ({ row }) => (
          <Typography noWrap sx={{ 
            fontSize: 13, 
            color: isDark ? "#9ca3af" : "#475569",
            maxWidth: 250,
          }}>
            {row.original.message}
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
        accessorKey: "timestamp",
        header: "Date",
        cell: ({ row }) => (
          <Typography sx={{ 
            fontSize: 13, 
            color: isDark ? "#9ca3af" : "#475569" 
          }}>
            {formatDate(row.original.timestamp)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const feedback = row.original;
          return (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => handleOpenViewDialog(feedback)}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Icon icon="lucide:eye" style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reply">
                <IconButton
                  size="small"
                  onClick={() => handleOpenReplyDialog(feedback)}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Icon icon="lucide:reply" style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={feedback.status === "open" ? "Close Feedback" : "Reopen Feedback"}>
                <IconButton
                  size="small"
                  onClick={() => handleStatusChange(feedback.id, feedback.status === "open" ? "closed" : "open")}
                  sx={{
                    color: feedback.status === "open" ? "#16a34a" : "#d97706",
                    "&:hover": {
                      bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.1)" : "rgba(217,119,6,0.1)",
                    },
                  }}
                >
                  <Icon 
                    icon={feedback.status === "open" ? "lucide:check-circle" : "lucide:clock"} 
                    style={{ fontSize: 18 }} 
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
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
            Feedback Management
          </Typography>
          <Typography sx={{ 
            fontSize: 13.5, 
            color: isDark ? "#9ca3af" : "#475569", 
            mt: 0.4 
          }}>
            Review and respond to customer feedback
          </Typography>
        </Box>

        {/* Summary cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4}>
            <SummaryCard
              icon="lucide:message-square"
              label="Total Feedback"
              value={summary.totalCount.toString()}
              accent="#6366f1"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <SummaryCard
              icon="lucide:clock"
              label="Open"
              value={summary.openCount.toString()}
              accent="#d97706"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <SummaryCard
              icon="lucide:check-circle-2"
              label="Closed"
              value={summary.closedCount.toString()}
              accent="#16a34a"
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
            placeholder="Search by name, email, or feedback..."
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
            {(["all", "open", "closed"] as StatusFilter[]).map((s) => (
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

        {/* Table */}
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
              No feedback matches your search or filters.
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

      {/* Dialogs */}
      <ReplyDialog
        open={replyDialogOpen}
        onClose={() => {
          setReplyDialogOpen(false);
          setSelectedFeedback(null);
        }}
        onSubmit={handleReplySubmit}
        feedback={selectedFeedback}
      />

      <ViewFeedbackDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedFeedback(null);
        }}
        feedback={selectedFeedback}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            borderRadius: 2,
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            color: isDark ? "#ffffff" : "#0f172a",
            border: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function FeedbackPage() {
  return <FeedbackContent />;
}