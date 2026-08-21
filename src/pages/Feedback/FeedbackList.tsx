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
  Fade,
  Slide,
  Grow,
  Zoom,
} from "@mui/material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import MyEditor from '../Htmleditor/MyEditor';

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
  "Dhamu", "Thaniga", "Dinesh", "Deva", "Suriya", "Prabhu", "Karthik", "Vijay", "Suresh", "Ravi"
];

const EMAILS = [
  "dhamu@gmail.com", "thaniga@gmail.com", "dinesh@gmail.com", "deva@gmail.com", 
  "suriya@gmail.com", "prabhu@gmail.com", "karthik@gmail.com", "vijay@gmail.com",
  "suresh@gmail.com", "ravi@gmail.com"
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
    const email = EMAILS[i % EMAILS.length];
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
      userEmail: email,
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
  const [content, setContent] = useState<string>('');

  const handleChange = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };
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
      maxWidth="lg" 
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ timeout: 400 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          bgcolor: isDark ? "#0F1828" : "#ffffff",
          animation: "dialog-enter 0.5s ease-out",
          "@keyframes dialog-enter": {
            "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: 0 },
            "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
          },
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Zoom in timeout={800}>
            <Avatar 
              sx={{ 
                bgcolor: "primary.main",
                // animation: "spin-avatar 4s linear infinite, glow-avatar 2s ease-in-out infinite",
                // "@keyframes spin-avatar": {
                //   "0%": { transform: "rotate(0deg)" },
                //   "100%": { transform: "rotate(360deg)" },
                // },
                // "@keyframes glow-avatar": {
                //   "0%, 100%": { boxShadow: "0 0 10px rgba(99,102,241,0.3)" },
                //   "50%": { boxShadow: "0 0 30px rgba(99,102,241,0.6)" },
                // },
              }}
            >
              {feedback.userName.charAt(0)}
            </Avatar>
          </Zoom>
          <Box>
            <Typography sx={{ 
              color: isDark ? "#ffffff" : "#0f172a",
              animation: "slide-in-right 0.5s ease-out",
              "@keyframes slide-in-right": {
                "0%": { transform: "translateX(-20px)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 },
              },
            }}>
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
            borderLeft: "3px solid",
            borderColor: "primary.main",
            animation: "slide-in-left 0.6s ease-out",
            "@keyframes slide-in-left": {
              "0%": { transform: "translateX(-30px) scale(0.95)", opacity: 0 },
              "100%": { transform: "translateX(0) scale(1)", opacity: 1 },
            },
          }}
        >
          <Typography variant="body2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Original Message:
          </Typography>
          <Typography sx={{ 
            color: isDark ? "#ffffff" : "#0f172a",
            animation: "typewriter 1s steps(40, end)",
            "@keyframes typewriter": {
              "0%": { width: "0", opacity: 0 },
              "100%": { width: "100%", opacity: 1 },
            },
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}>
            {feedback.message}
          </Typography>
        </Paper>
 <MyEditor
        placeholder="Write your content here..."
        height="400"
        onChange={handleChange}
        setContent={content}
        defaultValue="<p>Initial content</p>"
      />
      
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05) rotate(-3deg)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
        //  disabled={!replyText.trim()}
          endIcon={<Icon icon="lucide:send" />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            transition: "all 0.4s ease",
            "&:hover:not(:disabled)": {
              transform: "scale(1.05) translateY(-3px)",
              boxShadow: "0 12px 35px rgba(99,102,241,0.4)",
            },
            "&:active:not(:disabled)": {
              transform: "scale(0.95)",
            },
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
const [content, setContent] = useState<string>('');

  const handleChange = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };
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
      maxWidth="lg" 
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          bgcolor: isDark ? "#0F1828" : "#ffffff",
          animation: "dialog-zoom 0.6s ease-out",
          "@keyframes dialog-zoom": {
            "0%": { transform: "scale(0.7) rotate(3deg)", opacity: 0 },
            "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
          },
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Zoom in timeout={800}>
              <Avatar 
                sx={{ 
                  bgcolor: "primary.main",
                  animation: "pulse-avatar 2s ease-in-out infinite, glow-avatar 2s ease-in-out infinite",
                  "@keyframes pulse-avatar": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                  },
                  "@keyframes glow-avatar": {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(99,102,241,0.3)" },
                    "50%": { boxShadow: "0 0 30px rgba(99,102,241,0.6)" },
                  },
                }}
              >
                {feedback.userName.charAt(0)}
              </Avatar>
            </Zoom>
            <Box>
              <Typography sx={{ 
                color: isDark ? "#ffffff" : "#0f172a",
                animation: "fade-in 0.5s ease-out",
                "@keyframes fade-in": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}>
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
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "rotate(180deg) scale(1.2)",
                    bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)",
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
        <Box sx={{ mb: 4}}>
          <Typography variant="subtitle2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Message
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: 2,
              borderLeft: "3px solid",
              borderColor: "secondary.main",
              animation: "slide-in-right 0.6s ease-out",
              "@keyframes slide-in-right": {
                "0%": { transform: "translateX(30px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateX(0) scale(1)", opacity: 1 },
              },
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
              {feedback.replies.map((reply, index) => (
                <Grow in timeout={300 + index * 150} key={reply.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: isDark ? "rgba(25,118,210,0.1)" : "rgba(25,118,210,0.05)",
                      borderRadius: 2,
                      borderLeft: "3px solid",
                      borderColor: "primary.main",
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateX(10px) scale(1.02)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                      },
                      animation: "slide-in-left 0.5s ease-out",
                      "@keyframes slide-in-left": {
                        "0%": { transform: "translateX(-20px)", opacity: 0 },
                        "100%": { transform: "translateX(0)", opacity: 1 },
                      },
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
                </Grow>
              ))}
            </Stack>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" sx={{ color: isDark ? "#9ca3af" : "#475569" }} gutterBottom>
            Add Reply
          </Typography>
                <MyEditor
        placeholder="Write your content here..."
        height="400"
        onChange={handleChange}
        setContent={content}
        defaultValue="<p>Initial content</p>"
      />
          {/* <TextField
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
                transition: "all 0.4s ease",
                "&:focus-within": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
                },
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
          /> */}
          <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              size="small"
              endIcon={<Icon icon="lucide:send" />}
              onClick={handleReply}
          //    disabled={!replyText.trim()}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                transition: "all 0.4s ease",
                "&:hover:not(:disabled)": {
                  transform: "scale(1.05) translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(99,102,241,0.3)",
                },
              }}
            >
              Send Reply
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: isDark ? "#9ca3af" : "#475569",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
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
  const [data, setData] = useState<FeedbackItem[]>(() => generateMockFeedbacks(10));
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
                  {feedback.userName}
                </Typography>
                <Typography noWrap sx={{ 
                  fontSize: 12, 
                  color: isDark ? "#9ca3af" : "#475569",
                  transition: "color 0.3s ease",
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
            transition: "all 0.3s ease",
            "&:hover": {
              color: isDark ? "#ffffff" : "#0f172a",
              transform: "scale(1.02)",
            },
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
            color: isDark ? "#9ca3af" : "#475569",
            transition: "color 0.3s ease",
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
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.3) rotate(-10deg)",
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
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
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.3) rotate(15deg)",
                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
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
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.3) rotate(180deg)",
                      bgcolor: feedback.status === "open" ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)",
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
            Feedback Management
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
            placeholder="Search by name, email, or feedback..."
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
            {(["all", "open", "closed"] as StatusFilter[]).map((s, index) => (
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

        {/* Table */}
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
                No feedback matches your search or filters.
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
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 400 }}
      >
        <Zoom in timeout={500}>
          <Alert
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              color: isDark ? "#ffffff" : "#0f172a",
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              animation: "slide-in-bottom 0.6s ease-out",
              "@keyframes slide-in-bottom": {
                "0%": { transform: "translateY(100px) scale(0.8)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Zoom>
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