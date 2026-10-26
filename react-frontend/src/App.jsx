import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { Landing, Auth } from "./pages/Public";
import { Dashboard, SearchPage, SettingsPage } from "./pages/Workspace";
import { Collection } from "./pages/Workspace";
import { getToken } from "./api";
function Protected({ children }) {
  const location = useLocation();
  return getToken() && localStorage.getItem("devvault_user") ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth register />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/notes"
        element={
          <Protected>
            <Collection kind="notes" />
          </Protected>
        }
      />
      <Route
        path="/snippets"
        element={
          <Protected>
            <Collection kind="snippets" />
          </Protected>
        }
      />
      <Route
        path="/resources"
        element={
          <Protected>
            <Collection kind="resources" />
          </Protected>
        }
      />
      <Route
        path="/bugs"
        element={
          <Protected>
            <Collection kind="bugs" />
          </Protected>
        }
      />
      <Route
        path="/projects"
        element={
          <Protected>
            <Collection kind="projects" />
          </Protected>
        }
      />
      <Route
        path="/search"
        element={
          <Protected>
            <SearchPage />
          </Protected>
        }
      />
      <Route
        path="/settings"
        element={
          <Protected>
            <SettingsPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
