import api from "../api/api";

export function criarJobGoogleMaps(payload) {
    return api.post("/jobs/google-maps", payload);
}

export function buscarStatusJob(id) {
    return api.get(`/jobs/${id}`);
}
