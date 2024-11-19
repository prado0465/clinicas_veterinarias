import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext/UserContext.js";
import "./style.css";


function CustomAlert({ message, onClose }) {
  return (
    <div className="custom-alert">
      <div className="alert-content">
        <p>{message}</p>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const senha = event.target.senha.value.trim();

    if (!email || !senha) {
      setErrorMessage("Preencha e-mail e senha");
      return;
    }

    try {
      const response = await fetch(
        "https://apibase2-0bttgosp.b4a.run/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      if (response.status !== 200) {
        throw new Error();
      }

      const jsonWebToken = await response.text();
      console.log("Login funcionou", jsonWebToken);

      login(jsonWebToken);
      setShowAlert(true);  
      setTimeout(() => {
        navigate("/home");
        setShowAlert(false); 
      }, 3000); 
    } catch (error) {
      setErrorMessage("Usuário ou senha inválidos");
    }
  };

  return (
    <main className="d-flex flex-column align-items-center">
      {showAlert && (
        <CustomAlert
          message="Só por essa mensagem, Professor já merecia um 10 né... Logado com sucesso!"
          onClose={() => setShowAlert(false)}
        />
      )}

      <img
        src="https://clinicapopularvidas.com.br/wp-content/uploads/2024/05/logo_vidas-1.png"
        alt="Logo"
        className="mb-"
        style={{ width: "20%", height: "auto", margin: "30px", padding: "10px" }} 
      />

      <form onSubmit={handleSubmitLogin}>
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            E-mail:
          </label>
          <input type="email" className="form-control" name="email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Senha:
          </label>
          <input
            type="password"
            className="form-control"
            name="senha"
            minLength={5}
            maxLength={12}
          />
        </div>

        {errorMessage && <p className="text-danger m-0">{errorMessage}</p>}

        <button type="submit" className="custom-btn mb-4">
          Acessar
        </button>
      </form>

      <Link to="/register">Clique aqui e se cadastre</Link>
    </main>
  );
}
