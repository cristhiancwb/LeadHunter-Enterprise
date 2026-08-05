import api from "../../services/api";
const resposta = await api.get("/dashboard/status");

setDados(resposta.data);