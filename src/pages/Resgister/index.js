import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Register() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleFormCadastroSubmit = async (event) => {
    event.preventDefault();

    const nome = event.target.nome.value.trim();
    const email = event.target.email.value.trim();
    const senha = event.target.senha.value.trim();
    const endereco = event.target.endereco.value.trim();
    const cpf = event.target.cpf.value.trim();

    const validarCPF = (cpf) => {
      cpf = cpf.replace(/[^\d]+/g, "");

      if (cpf.length !== 11) {
        return false;
      }

      if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
      }

      let soma = 0;
      let peso = 10;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
      }

      let digito1 = 11 - (soma % 11);
      digito1 = digito1 >= 10 ? 0 : digito1;

      soma = 0;
      peso = 11;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
      }

      let digito2 = 11 - (soma % 11);
      digito2 = digito2 >= 10 ? 0 : digito2;

      return cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome || !email || !senha || !endereco || !cpf) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (!validarCPF(cpf)) {
      setErrorMessage("CPF inválido. Verifique o número e tente novamente.");
      return;
    }

    if (senha.length < 5 || senha.length > 12) {
      setErrorMessage("A senha deve ter entre 5 e 12 caracteres.");
      return;
    }

    try {
      const response = await fetch(
        "https://apibase2-0bttgosp.b4a.run/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            endereco,
            cpf,
            senha,
          }),
        }
      );

      if (response.status != 201) {
        throw new Error(await response.text());
      }

      alert("Cadastro efetuado com sucesso!");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <main className="d-flex flex-column align-items-center pb-5">

      <img
        src="https://clinicapopularvidas.com.br/wp-content/uploads/2024/05/logo_vidas-1.png"
        alt="Logo"
        className="mb-"
        style={{ width: "20%", height: "auto", padding: "10px", margin: "30px" }}
      />


      <form onSubmit={handleFormCadastroSubmit}>
        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Nome:
          </label>
          <input name="nome" type="text" className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="form-label">
            E-mail:
          </label>
          <input name="email" type="email" className="form-control" required />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Senha:
          </label>
          <input
            name="senha"
            type="password"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="form-label">
            Endereço:
          </label>
          <input
            name="endereco"
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="" className="form-label">
            CPF:
          </label>
          <input
            minLength={11}
            maxLength={11}
            name="cpf"
            type="text"
            className="form-control"
            required
          />
          <p className="text-muted">CPF deve ser somente números.</p>
        </div>

        {errorMessage && <p className="text-danger m-0">{errorMessage}</p>}

        <button type="submit" className="custom-btn mb-4">
          Cadastrar
        </button>
      </form>

      <Link to="/">Voltar para login</Link>
    </main>
  );
}

