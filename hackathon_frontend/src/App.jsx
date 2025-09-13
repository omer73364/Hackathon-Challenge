import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./page/HomePage";
import CheckFingerPrint from "./page/CheckFingerPrint";
import LogPage from "./page/Log/LogPage";
import Dashboard from "./page/Dashboard";
import LanguageToggle from "./components/LanguageToggle";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import RegisterUser from "./page/users/RegisterUser";
import UsersPage from "./page/users/AllUsers";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <LanguageToggle />

        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/check" element={<CheckFingerPrint />} />
          <Route path="/logs" element={<LogPage />} />
          <Route path="/add-user" element={<RegisterUser />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
