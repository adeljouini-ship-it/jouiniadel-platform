import Login from "./Login";
import Admin from "./Admin";
import Student from "./Student";
import TableauBlanc from "./TableauBlanc";

function App() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  if (page === "admin") {
    return <Admin />;
  }

  if (page === "login") {
    return <Login />;
  }

  if (page === "tableau") {
    return <TableauBlanc />;
  }

  return <Student />;
}

export default App;