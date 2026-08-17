import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import "./AuthPageLayout.css"; // Import the CSS file

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid relative overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-400/10 to-brand-800/20 animate-gradient-xy"></div>
          
          {/* Animated Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 -top-20 -left-20 bg-brand-400/10 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute w-96 h-96 -bottom-32 -right-32 bg-brand-600/10 rounded-full blur-3xl animate-float-delay"></div>
            <div className="absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>

          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs animate-fade-in-up">
              <Link to="/" className="block mb-4 transition-transform duration-300 hover:scale-105">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/logo-pp-dark.png"
                  alt="Logo"
                  className="drop-shadow-lg"
                />
              </Link>
              <div className="space-y-3 text-center">
                <h4 className="text-gray-400 dark:text-white/60 animate-slide-in">
                  <span className="block text-2xl font-semibold text-white dark:text-white/90 mb-2 animate-gradient-text bg-gradient-to-r from-brand-400 via-white to-brand-400 bg-300% bg-clip-text text-transparent">
                    LogIn to Manage
                  </span>
                  <span className="block text-lg text-gray-300 dark:text-white/50">
                    fantastic thing
                  </span>
                  <span className="block mt-4 text-sm text-gray-400 dark:text-white/40">
                    If you don't have an account
                  </span>
                  <span className="block text-sm text-brand-400 dark:text-brand-300 font-medium animate-pulse">
                    you can register here
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
        {children}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          {/* <ThemeTogglerTwo /> */}
        </div>
      </div>

      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 0.6; transform: scale(1.1) translate(-45%, -45%); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
          background-size: 400% 400%;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animate-gradient-text {
          animation: gradient-text 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  );
}