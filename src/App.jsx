import Login from "./Login";
import Admin from "./Admin";
import Student from "./Student";

function App() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  if (page === "admin") {
    return <Admin />;
  }

  if (page === "login") {
    return <Login />;
  }

  return <Student />;
}

export default App;