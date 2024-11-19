import { useContext } from "react";
import { UserContext } from "../../context/UserContext/UserContext.js";


export function Header() {
  const { logout } = useContext(UserContext);

  return (
    <header
      className="navbar bg-dark border-bottom border-body d-flex p-2"
      data-bs-themes="dark"
    >

      <button className="custom-btn" onClick={() => logout()}>
        Sair
      </button>
    </header>
  );
}
