import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {  EyeCloseIcon, EyeIcon } from "../../icons";

// Shared professional styling for every MUI TextField in this form.
// Uses currentColor / inherit so it follows Tailwind's dark: text color
// on the wrapping element instead of MUI's palette.mode.
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.5rem",
    backgroundColor: "transparent",
    color: "inherit",
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.35)", // slate-400/35
    },
    "&:hover fieldset": {
      borderColor: "rgba(148, 163, 184, 0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1878b1",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "inherit",
    opacity: 0.6,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1878b1",
    opacity: 1,
  },
  "& .MuiInputBase-input": {
    color: "inherit",
    padding: "10px 14px",
    fontSize: "0.875rem",
  },
  "& .MuiInputBase-input::placeholder": {
    opacity: 0.45,
  },
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e:any) => {
    e.preventDefault();
    navigate("/dashboard");
  };
const theme = localStorage.getItem("theme")
console.log(theme,'tem');
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <style>{`
        @keyframes signin-fade-up {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes signin-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .signin-animate {
          opacity: 0;
          animation: signin-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .signin-blob {
          animation: signin-blob 12s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .signin-animate { opacity: 1; animation: none; }
          .signin-blob { animation: none; }
        }
      `}</style>

      {/* Ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none" />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full signin-blob bg-brand-500/10 blur-3xl pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div> */}
      <div className="relative z-10 flex flex-col justify-center flex-1 w-full max-w-xl px-4 mx-auto">
        <div
          className="w-full p-10 transition-shadow duration-300 bg-white border border-gray-100 shadow-xl signin-animate rounded-2xl dark:border-gray-800 dark:bg-gray-900 sm:p-14 hover:shadow-2xl text-gray-800 dark:text-white/90"
          style={{ animationDelay: "0.05s" }}
        >
          <div>
            <div
              className="flex flex-col items-center mb-8 text-center signin-animate"
              style={{ animationDelay: "0.12s" }}
            >
              {/* Illustration */}
              {theme == 'dark' ? (
           <img
  src="/images/logo/logo-pp-dark.png"
  alt="Logo"
  className="object-contain w-auto h-12 mb-6 sm:h-14"
/>
              ):
           
           <img
  src="/images/logo/logo-pp.png"
  alt="Logo"
  className="object-contain w-auto h-12 mb-6 sm:h-14"
/>
                }
              <p className="text-sm text-gray-500 dark:text-gray-400">
A Warm welcome to the new era of the project management application

              </p>
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.18s" }}
                >
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="info@gmail.com"
                    required
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </div>
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.24s" }}
                >
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    sx={textFieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div
                  className="flex items-center justify-between signin-animate"
                  style={{ animationDelay: "0.3s" }}
                >
                  <FormControlLabel
                    sx={{ mx: 0, alignItems: "center" }}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        sx={{
                          color: "rgba(148, 163, 184, 0.6)",
                          p: "4px 8px 4px 0",
                          "&.Mui-checked": { color: "#1878b1" },
                        }}
                      />
                    }
                    label={
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    }
                  />
                  <Link
                    to="/forgotpassword"
                    className="text-sm font-medium transition-colors text-[#1878b1] hover:text-[#146393]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div
                  className="signin-animate"
                  style={{ animationDelay: "0.36s" }}
                >
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-transform duration-200 rounded-lg bg-[#1878b1] shadow-theme-xs shadow-[#1878b1]/20 hover:bg-[#146393] hover:scale-[1.02] active:scale-[0.99]"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </Box>

            {/* <div
              className="mt-6 signin-animate"
              style={{ animationDelay: "0.42s" }}
            >
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="font-medium transition-colors text-[#1878b1] hover:text-[#146393]"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}