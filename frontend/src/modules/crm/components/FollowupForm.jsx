import { useState } from "react";
import { criarFollowup } from "../../../services/followupService";

import "./FollowupForm.css";

export default function FollowupForm({

    leadId,

    onCreated

}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        tipo: "WhatsApp",

        titulo: "",

        descricao: "",

        responsavel: "",

        data: ""

    });

    function alterarCampo(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function salvar(e) {

        e.preventDefault();

        if (!form.titulo.trim()) {

            alert("Informe um título.");

            return;

        }

        try {

            setLoading(true);

            await criarFollowup({

                lead_id: leadId,

                titulo: form.titulo,

                descricao: form.descricao,

                tipo: form.tipo,

                responsavel: form.responsavel,

                data: form.data || null

            });

            setForm({

                tipo: "WhatsApp",

                titulo: "",

                descricao: "",

                responsavel: "",

                data: ""

            });

            if (onCreated) {

                onCreated();

            }

        } catch (err) {

            console.error(err);

            alert(err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <form
            className="followup-form"
            onSubmit={salvar}
        >

            <h3>Novo Follow-up</h3>

            <div className="grid">

                <div>

                    <label>Tipo</label>

                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={alterarCampo}
                    >

                        <option>WhatsApp</option>
                        <option>Ligação</option>
                        <option>Email</option>
                        <option>Reunião</option>
                        <option>Visita</option>
                        <option>Proposta</option>
                        <option>Outro</option>

                    </select>

                </div>

                <div>

                    <label>Responsável</label>

                    <input
                        name="responsavel"
                        value={form.responsavel}
                        onChange={alterarCampo}
                    />

                </div>

            </div>

            <label>Título</label>

            <input
                name="titulo"
                value={form.titulo}
                onChange={alterarCampo}
                placeholder="Ex.: Enviar proposta comercial"
            />

            <label>Descrição</label>

            <textarea
                rows="4"
                name="descricao"
                value={form.descricao}
                onChange={alterarCampo}
            />

            <label>Data Agendada</label>

            <input
                type="datetime-local"
                name="data"
                value={form.data}
                onChange={alterarCampo}
            />

            <button
                type="submit"
                disabled={loading}
            >

                {

                    loading

                        ? "Salvando..."

                        : "Salvar Follow-up"

                }

            </button>

        </form>

    );

}