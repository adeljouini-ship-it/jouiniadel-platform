import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
        Vérification...
      </div>
    );
  }

  if (!session) {
    window.location.href = "/login";
    return null;
  }

  return children;
}