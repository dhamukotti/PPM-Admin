// DashboardPage.tsx - With #1878b2 Theme and Professional Hover Effects
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Avatar,
  Stack,
  Fade,
  Slide,
  Grow,
  Zoom,
  Paper,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  alpha,
  TablePagination,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";

// ============================================================================
// Types
// ============================================================================

interface User {
  id: string;
  username: string;
  email: string;
  organization: string;
  role: "Admin" | "Member" | "Viewer";
  avatar: string;
  projects: Project[];
}

interface SubTask {
  id: string;
  title: string;
  owner: string;
  plannedEffort: string;
  status: "Not Started" | "To Do" | "In Progress" | "Done";
  type: string;
  file?: string;
  notes?: string;
  dueDate: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  sprintId: string;
  createdAt: string;
  owner: string;
  type: string;
  devStatus: string;
  document?: string;
  timeline: string;
  users: string[];
  subtasks: SubTask[];
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  tasks: Task[];
}

interface Bug {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "active" | "completed" | "on-hold";
  createdAt: string;
  sprints: Sprint[];
  tasks: Task[];
  bugs: Bug[];
}

type ViewType = "projects" | "sprints" | "tasks" | "bugs" | "boards";

// ============================================================================
// Constants
// ============================================================================

const PRIMARY_COLOR = "#1878b2";
const PRIMARY_DARK = "#0d5a85";

// ============================================================================
// Mock Data - 10 Existing Users with Fixed Roles
// ============================================================================

const USERS: User[] = [
  {
    id: "user_1",
    username: "Dhamu",
    email: "dhamu@gmail.com",
    organization: "TechCorp",
    role: "Admin",
    avatar: PRIMARY_COLOR,
    projects: []
  },
  {
    id: "user_2",
    username: "Thaniga",
    email: "thaniga@gmail.com",
    organization: "InnovateLabs",
    role: "Member",
    avatar: "#0ea5e9",
    projects: []
  },
  {
    id: "user_3",
    username: "Dinesh",
    email: "dinesh@gmail.com",
    organization: "CloudSolutions",
    role: "Viewer",
    avatar: "#f59e0b",
    projects: []
  },
  {
    id: "user_4",
    username: "Deva",
    email: "deva@gmail.com",
    organization: "DataSphere",
    role: "Member",
    avatar: "#10b981",
    projects: []
  },
  {
    id: "user_5",
    username: "Suriya",
    email: "suriya@gmail.com",
    organization: "WebWorks",
    role: "Admin",
    avatar: "#f43f5e",
    projects: []
  },
  {
    id: "user_6",
    username: "Prabhu",
    email: "prabhu@gmail.com",
    organization: "TechCorp",
    role: "Member",
    avatar: "#8b5cf6",
    projects: []
  },
  {
    id: "user_7",
    username: "Karthik",
    email: "karthik@gmail.com",
    organization: "InnovateLabs",
    role: "Viewer",
    avatar: "#14b8a6",
    projects: []
  },
  {
    id: "user_8",
    username: "Vijay",
    email: "vijay@gmail.com",
    organization: "CloudSolutions",
    role: "Member",
    avatar: "#ec4899",
    projects: []
  },
  {
    id: "user_9",
    username: "Suresh",
    email: "suresh@gmail.com",
    organization: "DataSphere",
    role: "Admin",
    avatar: "#f97316",
    projects: []
  },
  {
    id: "user_10",
    username: "Ravi",
    email: "ravi@gmail.com",
    organization: "WebWorks",
    role: "Member",
    avatar: "#06b6d4",
    projects: []
  }
];

// ============================================================================
// Mock Data Generator for Projects, Sprints, Tasks, Bugs with Subtasks
// ============================================================================

const generateSubTasks = (taskTitle: string, index: number): SubTask[] => {
  const subTaskTitles = [
    "Research competitor",
    "Create wireframe layout",
    "Design high-fidelity mockup (Figma)",
    "Add error/validation states",
    "Write documentation",
    "Review and test",
    "Deploy to staging",
    "Get client feedback"
  ];
  
  const owners = ["frontend", "backend", "devops", "QA"];
  const statuses: ("Not Started" | "To Do" | "In Progress" | "Done")[] = 
    ["Not Started", "To Do", "In Progress", "Done"];
  const types = ["frontend", "backend", "design", "devops"];
  
  const numSubTasks = Math.floor(Math.random() * 3) + 2;
  const shuffled = subTaskTitles.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numSubTasks);
  
  return selected.map((title, idx) => ({
    id: `subtask_${taskTitle}_${index}_${idx}`,
    title,
    owner: owners[idx % owners.length],
    plannedEffort: `${Math.floor(Math.random() * 4) + 1}hrs`,
    status: statuses[idx % statuses.length],
    type: types[idx % types.length],
    file: Math.random() > 0.5 ? `doc_${idx}.pdf` : undefined,
    notes: Math.random() > 0.5 ? "as possible" : undefined,
    dueDate: `August ${Math.floor(Math.random() * 30) + 1}`,
  }));
};

const generateProjectsForUser = (userName: string, orgName: string): Project[] => {
  const projectNames = [
    "E-Commerce Platform",
    "Mobile App Development",
    "AI Chatbot Integration",
    "Analytics Dashboard",
    "CRM System",
    "Inventory Management",
    "HR Portal",
    "Payment Gateway"
  ];
  
  const statuses: ("active" | "completed" | "on-hold")[] = ["active", "active", "completed", "active", "on-hold", "active", "completed", "active"];
  const sprintNames = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"];
  const taskTitles = [
    "Design login page UI",
    "Implement API endpoints",
    "Fix authentication bug",
    "Write documentation",
    "Deploy to production",
    "Create unit tests",
    "Optimize performance",
    "Setup CI/CD pipeline",
    "Review PRs",
    "Update dependencies",
    "Database migration",
    "Security audit"
  ];
  const owners = ["frontend", "backend", "devops", "QA"];
  const types = ["frontend", "backend", "design", "devops"];
  const devStatuses = ["Done", "In Progress", "To Do", "Not Started"];
  
  const bugTitles = [
    "Authentication error",
    "Data not loading",
    "UI alignment issue",
    "Performance degradation",
    "API timeout",
    "Memory leak",
    "Security vulnerability",
    "Broken link",
    "Form validation issue",
    "Mobile responsiveness"
  ];

  const numProjects = Math.floor(Math.random() * 3) + 2;
  const shuffledProjects = projectNames.sort(() => Math.random() - 0.5);
  const selectedProjects = shuffledProjects.slice(0, numProjects);

  return selectedProjects.map((name, index) => {
    const status = statuses[index % statuses.length];
    const progress = Math.floor(Math.random() * 100);
    const sprintCount = Math.floor(Math.random() * 3) + 2;

    const sprints: Sprint[] = Array.from({ length: sprintCount }, (_, sIndex) => {
      const sprintStatuses: ("active" | "completed" | "upcoming")[] = ["active", "completed", "upcoming"];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + sIndex * 14);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 13);

      const sprintTasks: Task[] = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, tIndex) => {
        const taskTitle = taskTitles[(tIndex + sIndex + index) % taskTitles.length];
        const subtasks = generateSubTasks(taskTitle, tIndex);
        
        // Generate a proper timeline string
        const start = new Date();
        const end = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        
        return {
          id: `task_${index}_${sIndex}_${tIndex}`,
          title: taskTitle,
          description: `Complete ${taskTitle} for ${name}`,
          status: ["todo", "in-progress", "review", "done"][Math.floor(Math.random() * 4)] as Task["status"],
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as Task["priority"],
          assignee: userName,
          sprintId: `sprint_${index}_${sIndex}`,
          createdAt: new Date().toISOString(),
          owner: owners[(tIndex + sIndex) % owners.length],
          type: types[(tIndex + sIndex) % types.length],
          devStatus: devStatuses[(tIndex + sIndex) % devStatuses.length],
          document: Math.random() > 0.5 ? `doc_${tIndex}.pdf` : undefined,
          timeline: `${formatDateForTimeline(start)} - ${formatDateForTimeline(end)}`,
          users: [userName, `User ${Math.floor(Math.random() * 5) + 2}`],
          subtasks,
        };
      });

      return {
        id: `sprint_${index}_${sIndex}`,
        name: sprintNames[sIndex % sprintNames.length],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: sprintStatuses[sIndex % 3],
        tasks: sprintTasks,
      };
    });

    const allTasks = sprints.flatMap((s) => s.tasks);

    const bugs: Bug[] = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, bIndex) => ({
      id: `bug_${index}_${bIndex}`,
      title: bugTitles[(bIndex + index) % bugTitles.length],
      description: `Fix ${bugTitles[(bIndex + index) % bugTitles.length]} in ${name}`,
      severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as Bug["severity"],
      status: ["open", "in-progress", "resolved", "closed"][Math.floor(Math.random() * 4)] as Bug["status"],
      assignee: userName,
      createdAt: new Date().toISOString(),
    }));

    return {
      id: `project_${userName}_${index}`,
      name,
      description: `${name} - ${orgName} project`,
      progress,
      status,
      createdAt: new Date().toISOString(),
      sprints,
      tasks: allTasks,
      bugs,
    };
  });
};

const formatDateForTimeline = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()}${getDaySuffix(date.getDate())} ${months[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

USERS.forEach((user) => {
  user.projects = generateProjectsForUser(user.username, user.organization);
});

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function DashboardPage() {
  const { theme } = useCustomTheme();
  const isDark = theme === "dark";
  const [users] = useState<User[]>(USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<ViewType>("projects");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getPriorityColor = (priority: Task["priority"] | Bug["severity"]): string => {
    const colors: Record<string, string> = {
      low: "#22c55e",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusColor = (
    status: Task["status"] | Sprint["status"] | Bug["status"] | Project["status"] | SubTask["status"]
  ): string => {
    const colors: Record<string, string> = {
      todo: "#6b7280",
      "in-progress": "#3b82f6",
      review: "#8b5cf6",
      done: "#22c55e",
      active: PRIMARY_COLOR,
      completed: "#3b82f6",
      upcoming: "#f59e0b",
      "on-hold": "#ef4444",
      open: "#ef4444",
      resolved: "#22c55e",
      closed: "#6b7280",
      "Not Started": "#6b7280",
      "To Do": "#f59e0b",
      "In Progress": "#3b82f6",
      "Done": "#22c55e",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Admin: PRIMARY_COLOR,
      Member: "#22c55e",
      Viewer: "#f59e0b",
    };
    return colors[role] || "#6b7280";
  };

  const getRoleIcon = (role: string): string => {
    const icons: Record<string, string> = {
      Admin: "lucide:crown",
      Member: "lucide:user",
      Viewer: "lucide:eye",
    };
    return icons[role] || "lucide:user";
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setSelectedProject(null);
    setSelectedTask(null);
  };

  // ============================================================================
  // Project Detail View - Like Screenshot
  // ============================================================================

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    const project = selectedProject;
    const allTasks = project.tasks;

    return (
      <Box>
        {/* Project Header */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              animation: "slideInDown 0.6s ease-out",
              "@keyframes slideInDown": {
                "0%": { transform: "translateY(-50px) scale(0.95)", opacity: 0 },
                "100%": { transform: "translateY(0) scale(1)", opacity: 1 },
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={handleBackToProjects}
                  sx={{
                    color: isDark ? "#9ca3af" : "#475569",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2) rotate(-10deg)",
                      color: PRIMARY_COLOR,
                    },
                  }}
                >
                  <Icon icon="lucide:arrow-left" style={{ fontSize: 24 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInText 0.8s ease-out",
                      "@keyframes fadeInText": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: isDark ? "#9ca3af" : "#475569" }}>
                    {project.description}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Zoom in timeout={800}>
                  <Chip
                    label={project.status}
                    sx={{
                      bgcolor: getStatusColor(project.status) + "20",
                      color: getStatusColor(project.status),
                      fontWeight: 600,
                      animation: "pulse 2s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  />
                </Zoom>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                    Progress:
                  </Typography>
                  {/* <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                      width: 100,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor: PRIMARY_COLOR,
                        animation: "progressGlow 2s ease-in-out infinite",
                        "@keyframes progressGlow": {
                          "0%, 100%": { boxShadow: `0 0 5px ${alpha(PRIMARY_COLOR, 0.3)}` },
                          "50%": { boxShadow: `0 0 20px ${alpha(PRIMARY_COLOR, 0.6)}` },
                        },
                      },
                    }}
                  /> */}
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                    {project.progress}%
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Slide>

        {/* Tasks Table - Like Screenshot */}
        <Fade in timeout={700}>
          <TableContainer
            sx={{
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              borderRadius: "14px",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              overflow: "hidden",
              animation: "fadeInUp 0.8s ease-out",
              "@keyframes fadeInUp": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow
                  sx={{
                    animation: "slideInDown 0.5s ease-out",
                    "@keyframes slideInDown": {
                      "0%": { opacity: 0, transform: "translateY(-20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    TASK
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Owner
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Priority
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Timeline
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Users
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    DEVSTATUS
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                    DOCUMENT
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allTasks.map((task, index) => (
                  <>
                    <TableRow
                      key={task.id}
                      sx={{
                        "&:hover": {
                          bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                        },
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: `slideInRow 0.5s ease ${index * 0.08}s both`,
                        "@keyframes slideInRow": {
                          "0%": { opacity: 0, transform: "translateX(-30px)" },
                          "100%": { opacity: 1, transform: "translateX(0)" },
                        },
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                          {task.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={task.owner}
                          size="small"
                          sx={{
                            bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                            color: isDark ? "#ffffff" : "#0f172a",
                            fontSize: 11,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            bgcolor: getPriorityColor(task.priority) + "20",
                            color: getPriorityColor(task.priority),
                            fontWeight: 600,
                            fontSize: 10,
                            textTransform: "uppercase",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(task.status) + "20",
                            color: getStatusColor(task.status),
                            fontSize: 10,
                            textTransform: "uppercase",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {task.timeline || formatDate(new Date().toISOString())}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Stack direction="row" spacing={0.5}>
                          {task.users.map((user, idx) => (
                            <Zoom key={idx} in timeout={600 + idx * 100}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: idx % 2 === 0 ? PRIMARY_COLOR : "#22c55e",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "scale(1.3)",
                                  },
                                }}
                              >
                                {user.charAt(0).toUpperCase()}
                              </Avatar>
                            </Zoom>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {task.type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        <Chip
                          label={task.devStatus}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(task.devStatus as any) + "20",
                            color: getStatusColor(task.devStatus as any),
                            fontSize: 10,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: isDark ? "#1a2744" : "#e2e8f0" }}>
                        {task.document ? (
                          <Button
                            size="small"
                            startIcon={<Icon icon="lucide:file" style={{ fontSize: 14 }} />}
                            sx={{
                              fontSize: 11,
                              color: PRIMARY_COLOR,
                              textTransform: "none",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                                color: PRIMARY_DARK,
                              },
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Typography sx={{ fontSize: 12, color: isDark ? "#6b7280" : "#94a3b8" }}>
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Subtasks - Expanded View */}
                    {selectedTask?.id === task.id && task.subtasks.length > 0 && (
                      <TableRow
                        sx={{
                          animation: "expandIn 0.4s ease-out",
                          "@keyframes expandIn": {
                            "0%": { opacity: 0, transform: "scale(0.95)" },
                            "100%": { opacity: 1, transform: "scale(1)" },
                          },
                        }}
                      >
                        <TableCell colSpan={9} sx={{ p: 0 }}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.05) : alpha(PRIMARY_COLOR, 0.02),
                              borderTop: `1px solid ${isDark ? "#1a2744" : "#e2e8f0"}`,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isDark ? "#ffffff" : "#0f172a",
                                mb: 2,
                                animation: "fadeIn 0.5s ease-out",
                                "@keyframes fadeIn": {
                                  "0%": { opacity: 0 },
                                  "100%": { opacity: 1 },
                                },
                              }}
                            >
                              SUB TASK
                            </Typography>
                            
                            {/* Subtasks Header */}
                            <Grid container spacing={1} sx={{ mb: 1 }}>
                              <Grid item xs={3}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                  Owner
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                  Planned Effort
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                  Status
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                  File
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569" }}>
                                  DUE DATE
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Subtasks List */}
                            {task.subtasks.map((subtask, idx) => (
                              <Grow key={subtask.id} in timeout={300 + idx * 100}>
                                <Grid
                                  container
                                  spacing={1}
                                  sx={{
                                    py: 1.5,
                                    borderBottom: idx < task.subtasks.length - 1 ? `1px solid ${isDark ? "#1a2744" : "#e2e8f0"}` : "none",
                                    "&:hover": {
                                      bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.06) : alpha(PRIMARY_COLOR, 0.03),
                                      transform: "scale(1.01)",
                                      borderRadius: 1,
                                    },
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Grid item xs={3}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Typography sx={{ fontSize: 12, color: isDark ? "#ffffff" : "#0f172a" }}>
                                        {subtask.title}
                                      </Typography>
                                      <Chip
                                        label={subtask.type}
                                        size="small"
                                        sx={{
                                          bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                                          color: isDark ? "#9ca3af" : "#475569",
                                          fontSize: 9,
                                          height: 20,
                                        }}
                                      />
                                    </Stack>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                      {subtask.owner}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                      {subtask.plannedEffort}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Chip
                                      label={subtask.status}
                                      size="small"
                                      sx={{
                                        bgcolor: getStatusColor(subtask.status) + "20",
                                        color: getStatusColor(subtask.status),
                                        fontSize: 10,
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                      {subtask.file || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={1}>
                                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                                      {subtask.dueDate}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grow>
                            ))}

                            {/* Add Sub Task Button */}
                            <Button
                              startIcon={<Icon icon="lucide:plus" style={{ fontSize: 16 }} />}
                              sx={{
                                mt: 2,
                                color: PRIMARY_COLOR,
                                textTransform: "none",
                                fontSize: 13,
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: alpha(PRIMARY_COLOR, 0.08),
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              Add Sub Task
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      </Box>
    );
  };

  // ============================================================================
  // User List Table with Pagination
  // ============================================================================

  const renderUserTable = () => (
    <>
      <Fade in timeout={600}>
        <TableContainer
          sx={{
            border: "1px solid",
            borderColor: isDark ? "#1a2744" : "#e2e8f0",
            borderRadius: "14px",
            bgcolor: isDark ? "#0F1828" : "#ffffff",
            overflow: "hidden",
            animation: "fadeInUp 0.6s ease-out",
            "@keyframes fadeInUp": {
              "0%": { opacity: 0, transform: "translateY(30px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow
                sx={{
                  animation: "slideInDown 0.5s ease-out",
                  "@keyframes slideInDown": {
                    "0%": { opacity: 0, transform: "translateY(-20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  User
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Organization
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Projects
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Bugs
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#9ca3af" : "#475569", py: 1.5 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => {
                const totalBugs = user.projects.reduce((acc, p) => acc + p.bugs.length, 0);
                const openBugs = user.projects.reduce((acc, p) => acc + p.bugs.filter(b => b.status === "open").length, 0);
                const totalProjects = user.projects.length;

                return (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        bgcolor: isDark ? alpha(PRIMARY_COLOR, 0.08) : alpha(PRIMARY_COLOR, 0.04),
                        transform: "scale(1.01)",
                        boxShadow: `0 2px 12px ${alpha(PRIMARY_COLOR, 0.08)}`,
                      },
                      cursor: "pointer",
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      animation: `slideInRow 0.5s ease ${index * 0.08}s both`,
                      "@keyframes slideInRow": {
                        "0%": { opacity: 0, transform: "translateX(-30px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Zoom in timeout={500}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: user.avatar,
                              fontSize: 14,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.3) rotate(10deg)",
                              },
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </Zoom>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", color: isDark ? "#9ca3af" : "#475569", fontSize: 13, py: 1.5 }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                      <Chip
                        label={user.organization}
                        size="small"
                        sx={{
                          bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                          color: isDark ? "#ffffff" : "#0f172a",
                          fontWeight: 500,
                          fontSize: 11,
                          animation: "pulse 2s ease-in-out infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.03)" },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                      <Chip
                        icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: 14 }} />}
                        label={user.role}
                        size="small"
                        sx={{
                          bgcolor: getRoleColor(user.role) + "20",
                          color: getRoleColor(user.role),
                          fontWeight: 600,
                          fontSize: 11,
                          "& .MuiChip-icon": {
                            color: getRoleColor(user.role),
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, fontSize: 14, py: 1.5 }}>
                      {totalProjects}
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, fontSize: 14 }}>
                          {openBugs}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          / {totalBugs}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: isDark ? "#1a2744" : "#e2e8f0", py: 1.5 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: 12,
                          bgcolor: PRIMARY_COLOR,
                          transition: "all 0.3s ease",
                          animation: "bounceIn 0.6s ease",
                          "@keyframes bounceIn": {
                            "0%": { transform: "scale(0)" },
                            "50%": { transform: "scale(1.2)" },
                            "100%": { transform: "scale(1)" },
                          },
                          "&:hover": {
                            transform: "scale(1.1) translateY(-3px)",
                            bgcolor: PRIMARY_DARK,
                            boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.4)}`,
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      <Fade in timeout={700}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            mt: 2,
            color: isDark ? "#9ca3af" : "#475569",
            "& .MuiTablePagination-select": {
              color: isDark ? "#ffffff" : "#0f172a",
            },
            "& .MuiTablePagination-selectIcon": {
              color: isDark ? "#9ca3af" : "#475569",
            },
            "& .MuiTablePagination-actions button": {
              color: isDark ? "#9ca3af" : "#475569",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: PRIMARY_COLOR,
              },
            },
          }}
        />
      </Fade>
    </>
  );

  // ============================================================================
  // User Detail View (Full Screen - No Team Members or Search)
  // ============================================================================

  const renderUserDetail = () => {
    if (!selectedUser) return null;

    const user = selectedUser;
    const projects = user.projects;
    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
    const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter((t) => t.status === "done").length, 0);
    const totalBugs = projects.reduce((acc, p) => acc + p.bugs.length, 0);
    const openBugs = projects.reduce((acc, p) => acc + p.bugs.filter((b) => b.status === "open").length, 0);

    // Projects View - Professional Hover Effects
    const renderProjects = () => (
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
            <Grow in timeout={800 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isDark ? "#1a2744" : "#e2e8f0",
                  bgcolor: isDark ? "#0F1828" : "#ffffff",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 50%)`,
                    opacity: 0,
                    transition: "opacity 0.6s ease",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)})`,
                    transform: "scaleX(0)",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transformOrigin: "left",
                  },
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: `0 16px 48px ${alpha(PRIMARY_COLOR, 0.15)}`,
                    borderColor: PRIMARY_COLOR,
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                }}
                onClick={() => handleProjectClick(project)}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {project.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569", mt: 0.5 }}>
                      {project.description}
                    </Typography>
                  </Box>
                  <Zoom in timeout={1000}>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(project.status) + "20",
                        color: getStatusColor(project.status),
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: "uppercase",
                      }}
                    />
                  </Zoom>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon icon="lucide:git-branch" style={{ fontSize: 14, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                      {project.sprints.length} sprints
                    </Typography>
                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: isDark ? "#1a2744" : "#e2e8f0" }} />
                    <Icon icon="lucide:bug" style={{ fontSize: 14, color: isDark ? "#6b7280" : "#94a3b8" }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                      {project.bugs.filter(b => b.status === "open").length} bugs
                    </Typography>
                  </Stack>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${project.progress}%`,
                          height: "100%",
                          bgcolor: PRIMARY_COLOR,
                          borderRadius: 2,
                          transition: "width 1.5s ease",
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569", fontWeight: 600 }}>
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    );

    // Sprints View - Professional Hover Effects
    const renderSprints = () => (
      <Box>
        {projects.map((project, pIndex) => (
          <Box key={project.id} sx={{ mb: 3 }}>
            <Fade in timeout={600 + pIndex * 100}>
              <Typography sx={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: 600, mb: 1 }}>
                {project.name}
              </Typography>
            </Fade>
            <Grid container spacing={2}>
              {project.sprints.map((sprint, index) => (
                <Grid item xs={12} sm={6} lg={4} key={sprint.id}>
                  <Fade in timeout={600 + pIndex * 100 + index * 80}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 50%)`,
                          opacity: 0,
                          transition: "opacity 0.6s ease",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.3)})`,
                          transform: "scaleX(0)",
                          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          transformOrigin: "left",
                        },
                        "&:hover": {
                          transform: "translateY(-6px) scale(1.02)",
                          boxShadow: `0 12px 40px ${alpha(PRIMARY_COLOR, 0.12)}`,
                          borderColor: PRIMARY_COLOR,
                        },
                        "&:hover::before": {
                          opacity: 1,
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a" }}>
                            {sprint.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                          </Typography>
                        </Box>
                        <Chip
                          label={sprint.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(sprint.status) + "20",
                            color: getStatusColor(sprint.status),
                            fontWeight: 600,
                            fontSize: 10,
                            textTransform: "uppercase",
                          }}
                        />
                      </Box>
                      <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {sprint.tasks.length} tasks
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#9ca3af" : "#475569" }}>
                          {sprint.tasks.filter((t) => t.status === "done").length} done
                        </Typography>
                      </Box>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );

    // Tasks View
    const renderTasks = () => (
      <Grid container spacing={2}>
        {projects.flatMap((project, pIndex) =>
          project.tasks.slice(0, 6).map((task, index) => (
            <Grid item xs={12} sm={6} lg={4} key={task.id}>
              <Slide in timeout={800 + pIndex * 100 + index * 80} direction="up">
                <Card
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 16px 48px ${alpha(PRIMARY_COLOR, 0.12)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(task.priority) + "20",
                        color: getPriorityColor(task.priority),
                        fontWeight: 600,
                        fontSize: 9,
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569", mb: 1 }}>
                    {task.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(task.status) + "20",
                        color: getStatusColor(task.status),
                        fontSize: 10,
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      {task.assignee}
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))
        )}
      </Grid>
    );

    // Bugs View
    const renderBugs = () => (
      <Grid container spacing={2}>
        {projects.flatMap((project, pIndex) =>
          project.bugs.map((bug, index) => (
            <Grid item xs={12} sm={6} lg={4} key={bug.id}>
              <Slide in timeout={800 + pIndex * 100 + index * 80} direction="up">
                <Card
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 16px 48px ${alpha(PRIMARY_COLOR, 0.12)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                      {bug.title}
                    </Typography>
                    <Chip
                      label={bug.severity}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(bug.severity) + "20",
                        color: getPriorityColor(bug.severity),
                        fontWeight: 600,
                        fontSize: 9,
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569", mb: 1 }}>
                    {bug.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={bug.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(bug.status) + "20",
                        color: getStatusColor(bug.status),
                        fontSize: 10,
                      }}
                    />
                    <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      {bug.assignee}
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))
        )}
      </Grid>
    );

    // Boards View
    const renderBoards = () => (
      <Box>
        <Typography
          sx={{
            color: isDark ? "#ffffff" : "#0f172a",
            fontSize: 18,
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            animation: "fadeInDown 0.8s ease-out",
            "@keyframes fadeInDown": {
              "0%": { opacity: 0, transform: "translateY(-20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {user.username}'s Project Boards
        </Typography>
        <Grid container spacing={3}>
          {projects.map((project, pIndex) => (
            <Grid item xs={12} lg={6} key={project.id}>
              <Slide in timeout={600 + pIndex * 150} direction="left">
                <Card
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 20px 60px ${alpha(PRIMARY_COLOR, 0.12)}`,
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: isDark ? "#ffffff" : "#0f172a", mb: 2 }}>
                    {project.name}
                  </Typography>
                  <Grid container spacing={1}>
                    {(["todo", "in-progress", "review", "done"] as Task["status"][]).map((status, idx) => {
                      const tasks = project.tasks.filter((t) => t.status === status);
                      return (
                        <Grid item xs={3} key={status}>
                          <Grow in timeout={800 + idx * 100}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                                border: "1px solid",
                                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "scale(1.05) translateY(-4px)",
                                  boxShadow: `0 8px 25px ${alpha(PRIMARY_COLOR, 0.1)}`,
                                  borderColor: PRIMARY_COLOR,
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 10,
                                  color: isDark ? "#9ca3af" : "#475569",
                                  textTransform: "uppercase",
                                }}
                              >
                                {status}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 18,
                                  fontWeight: 700,
                                  color: isDark ? "#ffffff" : "#0f172a",
                                }}
                              >
                                {tasks.length}
                              </Typography>
                            </Paper>
                          </Grow>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      Bugs: {project.bugs.filter((b) => b.status !== "closed").length} open
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                      Progress: {project.progress}%
                    </Typography>
                  </Box>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    );

    // ============================================================================
    // User Detail Main Render - Full Screen
    // ============================================================================

    return (
      <Box>
        {/* User Profile Header - Full Width */}
        <Slide in timeout={500} direction="down">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDark ? "#1a2744" : "#e2e8f0",
              bgcolor: isDark ? "#0F1828" : "#ffffff",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.05)}, transparent 70%)`,
                animation: "bgFloat 10s ease-in-out infinite",
                "@keyframes bgFloat": {
                  "0%, 100%": { transform: "translate(0, 0)" },
                  "33%": { transform: "translate(-30px, -20px)" },
                  "66%": { transform: "translate(30px, 20px)" },
                },
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Zoom in timeout={800}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: user.avatar,
                      fontSize: 28,
                      fontWeight: 700,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Zoom>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      animation: "fadeInRight 0.8s ease-out",
                      "@keyframes fadeInRight": {
                        "0%": { opacity: 0, transform: "translateX(-20px)" },
                        "100%": { opacity: 1, transform: "translateX(0)" },
                      },
                    }}
                  >
                    {user.username}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: isDark ? "#9ca3af" : "#475569" }}>
                    {user.email}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Chip
                      label={user.organization}
                      sx={{
                        bgcolor: isDark ? "#1a2744" : "#e2e8f0",
                        color: isDark ? "#ffffff" : "#0f172a",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      icon={<Icon icon={getRoleIcon(user.role)} style={{ fontSize: 14 }} />}
                      label={user.role}
                      sx={{
                        bgcolor: getRoleColor(user.role) + "20",
                        color: getRoleColor(user.role),
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: getRoleColor(user.role),
                        },
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                {[
                  { label: "Projects", value: projects.length, icon: "lucide:folder", color: PRIMARY_COLOR },
                  { label: "Tasks Done", value: `${completedTasks}/${totalTasks}`, icon: "lucide:check-square", color: "#22c55e" },
                  { label: "Bugs Open", value: `${openBugs}/${totalBugs}`, icon: "lucide:bug", color: "#ef4444" },
                ].map((stat, idx) => (
                  <Zoom key={stat.label} in timeout={700 + idx * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: isDark ? "#1a2744" : "#e2e8f0",
                        bgcolor: isDark ? "#0F1828" : "#ffffff",
                        textAlign: "center",
                        minWidth: 90,
                        transition: "all 0.4s ease",
                        "&:hover": {
                          transform: "scale(1.1) translateY(-4px)",
                          boxShadow: `0 8px 30px ${alpha(stat.color, 0.2)}`,
                          borderColor: stat.color,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: stat.color,
                          animation: "countUp 1s ease-out",
                          "@keyframes countUp": {
                            "0%": { transform: "scale(0.5)", opacity: 0 },
                            "100%": { transform: "scale(1)", opacity: 1 },
                          },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: isDark ? "#9ca3af" : "#475569" }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </Zoom>
                ))}
              </Stack>
              <Button
                variant="contained"
                onClick={handleBackToUsers}
                startIcon={<Icon icon="lucide:arrow-left" style={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  bgcolor: PRIMARY_COLOR,
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.05) translateX(-5px)",
                    bgcolor: PRIMARY_DARK,
                    boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.4)}`,
                  },
                }}
              >
                Back to All Users
              </Button>
            </Stack>
          </Paper>
        </Slide>

        {/* Navigation Tabs */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {(["projects", "sprints", "tasks", "bugs", "boards"] as ViewType[]).map((item, idx) => (
              <Grow key={item} in timeout={1200 + idx * 100}>
                <Chip
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  onClick={() => setView(item)}
                  icon={
                    <Icon
                      icon={`lucide:${
                        item === "projects"
                          ? "folder"
                          : item === "sprints"
                          ? "git-branch"
                          : item === "tasks"
                          ? "check-square"
                          : item === "bugs"
                          ? "bug"
                          : "layout-dashboard"
                      }`}
                    />
                  }
                  sx={{
                    px: 1.5,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: 13,
                    fontWeight: 600,
                    bgcolor: view === item ? PRIMARY_COLOR : isDark ? "#0F1828" : "#ffffff",
                    color: view === item ? "#ffffff" : isDark ? "#9ca3af" : "#475569",
                    border: "1px solid",
                    borderColor: view === item ? PRIMARY_COLOR : isDark ? "#1a2744" : "#e2e8f0",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: view === item ? "scale(1.05)" : "scale(1.1) translateY(-4px)",
                      boxShadow: view === item ? `0 8px 30px ${alpha(PRIMARY_COLOR, 0.4)}` : `0 4px 20px ${alpha(PRIMARY_COLOR, 0.1)}`,
                    },
                    "& .MuiChip-icon": {
                      color: view === item ? "#ffffff" : "inherit",
                    },
                  }}
                />
              </Grow>
            ))}
          </Stack>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            animation: "fadeInScale 0.6s ease-out",
            "@keyframes fadeInScale": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          {selectedProject ? (
            renderProjectDetail()
          ) : (
            <>
              {view === "projects" && renderProjects()}
              {view === "sprints" && renderSprints()}
              {view === "tasks" && renderTasks()}
              {view === "bugs" && renderBugs()}
              {view === "boards" && renderBoards()}
            </>
          )}
        </Box>
      </Box>
    );
  };

  // ============================================================================
  // Main Dashboard Render
  // ============================================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#0F1828" : "#f8fafc",
        p: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "fixed",
          top: -200,
          right: -200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.03)}, transparent 70%)`,
          animation: "bgFloatBig 20s ease-in-out infinite",
          "@keyframes bgFloatBig": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(-50px, -30px) scale(1.2)" },
            "66%": { transform: "translate(50px, 20px) scale(0.8)" },
          },
        },
        "&::after": {
          content: '""',
          position: "fixed",
          bottom: -200,
          left: -200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(PRIMARY_COLOR, 0.02)}, transparent 70%)`,
          animation: "bgFloatBigReverse 25s ease-in-out infinite",
          "@keyframes bgFloatBigReverse": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(50px, 30px) scale(1.3)" },
            "66%": { transform: "translate(-50px, -20px) scale(0.7)" },
          },
        },
      }}
    >
      {/* Show Global View (Header + Search + Users Table) ONLY when no user is selected */}
      {!selectedUser ? (
        <>
          {/* Header */}
          <Grow in timeout={600}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: isDark ? "#1a2744" : "#e2e8f0",
                bgcolor: isDark ? "#0F1828" : "#ffffff",
                position: "relative",
                overflow: "hidden",
                animation: "slideDown 0.6s ease-out",
                "@keyframes slideDown": {
                  "0%": { opacity: 0, transform: "translateY(-30px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Zoom in timeout={800}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: PRIMARY_COLOR,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "pulseIcon 2s ease-in-out infinite",
                      "@keyframes pulseIcon": {
                        "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                        "50%": { transform: "scale(1.1) rotate(5deg)" },
                      },
                    }}
                  >
                    <Icon icon="lucide:users" style={{ fontSize: 24, color: "#fff" }} />
                  </Box>
                </Zoom>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${alpha(PRIMARY_COLOR, 0.6)}, ${PRIMARY_COLOR})`,
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "shimmerText 3s linear infinite",
                      "@keyframes shimmerText": {
                        "0%": { backgroundPosition: "200% center" },
                        "100%": { backgroundPosition: "0% center" },
                      },
                    }}
                  >
                    Team Dashboard
                  </Typography>
                  <Typography sx={{ color: isDark ? "#9ca3af" : "#475569", fontSize: 13 }}>
                    {users.length} team members • Click on any user to view details
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${users.length} Users`}
                sx={{
                  bgcolor: isDark ? "#1a2744" : "#f1f5f9",
                  color: isDark ? "#ffffff" : "#0f172a",
                  fontWeight: 600,
                  animation: "pulseChip 2s ease-in-out infinite",
                  "@keyframes pulseChip": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.03)" },
                  },
                }}
              />
            </Box>
          </Grow>

          {/* Search - Only in Global View */}
          <Fade in timeout={700}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="🔍 Search users by name, email, or organization..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                    transition: "all 0.4s ease",
                    "& fieldset": {
                      borderColor: isDark ? "#1a2744" : "#e2e8f0",
                      transition: "border-color 0.3s ease",
                    },
                    "&:hover": {
                      transform: "scale(1.01)",
                      "& fieldset": {
                        borderColor: isDark ? "#2a3a5c" : "#94a3b8",
                      },
                    },
                    "&.Mui-focused": {
                      transform: "scale(1.02)",
                      boxShadow: `0 8px 30px ${alpha(PRIMARY_COLOR, 0.15)}`,
                      "& fieldset": {
                        borderColor: PRIMARY_COLOR,
                      },
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
            </Box>
          </Fade>

          {/* Users Table - Only in Global View */}
          <Box>
            <Typography
              sx={{
                color: isDark ? "#ffffff" : "#0f172a",
                fontSize: 16,
                fontWeight: 600,
                mb: 2,
                animation: "fadeIn 0.8s ease-out",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              All Team Members
            </Typography>
            {filteredUsers.length === 0 ? (
              <Zoom in timeout={600}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: isDark ? "#1a2744" : "#e2e8f0",
                    borderRadius: 3,
                    bgcolor: isDark ? "#0F1828" : "#ffffff",
                  }}
                >
                  <Typography sx={{ color: isDark ? "#9ca3af" : "#475569" }}>
                    No users found matching your search.
                  </Typography>
                </Card>
              </Zoom>
            ) : (
              renderUserTable()
            )}
          </Box>
        </>
      ) : (
        // User Detail View - Full Screen (No Header, No Search, No Team Members)
        renderUserDetail()
      )}
    </Box>
  );
}