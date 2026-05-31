import Login from "./Login";
import Admin from "./Admin";
import Student from "./Student";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const path = window.location.pathname;

  if (path === "/admin") {
    return (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    );
  }

  if (path === "/login") {
    return <Login />;
  }

  return <Student />;
}

export default App;