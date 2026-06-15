import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../contexts/Login";

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToken, addIdToken, token } = useLogin();

    useEffect(() => {
    if (!location || !location.search) return;

    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const codeVerifier = sessionStorage.getItem('pkce_verifier');
    console.log("CODE:", code);

    if (!code) return;

    fetch("/api/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  code: code, code_verifier: codeVerifier  }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.access_token)
            addToken(data.access_token);
            addIdToken(data.id_token);
        })
        .catch(console.error);
    }, [location?.search]);

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return <div>Logging in...</div>;
}