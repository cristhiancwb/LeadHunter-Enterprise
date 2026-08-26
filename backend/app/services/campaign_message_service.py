from datetime import datetime

from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.campaign_message import CampaignMessage
from app.models.campaign_product import CampaignProduct
from app.models.lead import Lead
from app.models.message_template import MessageTemplate
from app.services.ai_message_service import AIMessageService

from app.schemas.campaign_message import (
    CampaignMessageGenerate,
)


class CampaignMessageService:

    @staticmethod
    def gerar(
        db: Session,
        campaign_id: int,
        dados: CampaignMessageGenerate,
    ):

        campanha = (
            db.query(Campaign)
            .filter(
                Campaign.id == campaign_id
            )
            .first()
        )

        if not campanha:
            return None, "Campanha não encontrada"

        # ========================================================
        # TEMPLATE
        # ========================================================

        template = None

        if dados.template_id:

            template = (
                db.query(MessageTemplate)
                .filter(
                    MessageTemplate.id == dados.template_id,
                    MessageTemplate.ativo == True,
                )
                .first()
            )

            if not template:
                return None, "Template não encontrado ou inativo"

        else:

            # Quando o frontend não informar template_id,
            # utiliza automaticamente o primeiro template ativo
            # compatível com o canal da campanha.

            canal_template = (
                dados.canal
                or campanha.canal
            )

            query_template = (
                db.query(MessageTemplate)
                .filter(
                    MessageTemplate.ativo == True
                )
            )

            if canal_template:

                query_template = query_template.filter(
                    MessageTemplate.canal == canal_template
                )

            template = (
                query_template
                .order_by(
                    MessageTemplate.id.asc()
                )
                .first()
            )

            # Fallback: primeiro template ativo disponível.
            if not template:

                template = (
                    db.query(MessageTemplate)
                    .filter(
                        MessageTemplate.ativo == True
                    )
                    .order_by(
                        MessageTemplate.id.asc()
                    )
                    .first()
                )

        # ========================================================
        # PRODUTO PRINCIPAL DA CAMPANHA
        # ========================================================

        produto_campanha = (
            db.query(CampaignProduct)
            .filter(
                CampaignProduct.campaign_id == campaign_id,
                CampaignProduct.ativo == True,
            )
            .order_by(
                CampaignProduct.created_at.asc()
            )
            .first()
        )

        produto = (
            produto_campanha.product
            if produto_campanha
            else None
        )

        # ========================================================
        # LEADS
        # ========================================================
        #
        # lead_ids preenchido:
        #     gera somente para os IDs informados.
        #
        # lead_ids vazio:
        #     gera para todos os leads.
        # ========================================================

        if dados.lead_ids:

            leads = (
                db.query(Lead)
                .filter(
                    Lead.id.in_(dados.lead_ids)
                )
                .order_by(
                    Lead.id.asc()
                )
                .all()
            )

        else:

            leads = (
                db.query(Lead)
                .order_by(
                    Lead.id.asc()
                )
                .all()
            )

        mensagens = []

        # ========================================================
        # DADOS DA CAMPANHA
        # ========================================================

        canal = (
            dados.canal
            or campanha.canal
            or (template.canal if template else None)
            or "email"
        )

        # ========================================================
        # EMPRESA REMETENTE
        # ========================================================
        #
        # A campanha ainda não possui campo específico para
        # empresa_remetente.
        #
        # Utilizamos o nome da campanha como fallback temporário,
        # evitando deixar o placeholder exposto na mensagem.
        # ========================================================

        empresa_remetente = (
            campanha.nome
            or "nossa empresa"
        )

        # ========================================================
        # PRODUTO
        # ========================================================

        nome_produto = (
            produto.nome
            if produto
            else ""
        )

        sku_produto = (
            produto.sku
            if produto
            else ""
        )

        descricao_produto = (
            produto.descricao
            if produto
            else ""
        )

        preco_produto = (
            produto.preco
            if produto
            else ""
        )

        preco_oferta = (
            produto_campanha.preco_oferta
            if produto_campanha
            and produto_campanha.preco_oferta is not None
            else preco_produto
        )

        quantidade_oferta = (
            produto_campanha.quantidade_oferta
            if produto_campanha
            and produto_campanha.quantidade_oferta is not None
            else ""
        )

        # ========================================================
        # GERACAO
        # ========================================================

        for lead in leads:

            # ----------------------------------------------------
            # EVITA DUPLICIDADE
            # ----------------------------------------------------

            existente = (
                db.query(CampaignMessage)
                .filter(
                    CampaignMessage.campaign_id == campaign_id,
                    CampaignMessage.lead_id == lead.id,
                )
                .first()
            )

            if existente:
                continue

            # ----------------------------------------------------
            # CONTEUDO BASE
            # ----------------------------------------------------

            assunto = (
                template.titulo
                if template
                else None
            )

            mensagem = (
                template.conteudo
                if template
                else ""
            )

            # ----------------------------------------------------
            # PLACEHOLDERS DO LEAD
            # ----------------------------------------------------

            mensagem = mensagem.replace(
                "{{nome}}",
                lead.nome or ""
            )

            mensagem = mensagem.replace(
                "{{empresa}}",
                lead.empresa or ""
            )

            mensagem = mensagem.replace(
                "{{telefone}}",
                lead.telefone or ""
            )

            mensagem = mensagem.replace(
                "{{email}}",
                lead.email or ""
            )

            mensagem = mensagem.replace(
                "{{cidade}}",
                lead.cidade or ""
            )

            # ----------------------------------------------------
            # PLACEHOLDER DA EMPRESA REMETENTE
            # ----------------------------------------------------

            mensagem = mensagem.replace(
                "{{empresa_remetente}}",
                str(empresa_remetente)
            )

            # ----------------------------------------------------
            # PLACEHOLDERS DO PRODUTO
            # ----------------------------------------------------

            mensagem = mensagem.replace(
                "{{produto}}",
                str(nome_produto)
            )

            mensagem = mensagem.replace(
                "{{produto_nome}}",
                str(nome_produto)
            )

            mensagem = mensagem.replace(
                "{{produto_descricao}}",
                str(descricao_produto)
            )

            mensagem = mensagem.replace(
                "{{descricao_produto}}",
                str(descricao_produto)
            )

            mensagem = mensagem.replace(
                "{{sku}}",
                str(sku_produto)
            )

            mensagem = mensagem.replace(
                "{{preco}}",
                str(preco_produto)
            )

            mensagem = mensagem.replace(
                "{{preco_produto}}",
                str(preco_produto)
            )

            mensagem = mensagem.replace(
                "{{preco_oferta}}",
                str(preco_oferta)
            )

            mensagem = mensagem.replace(
                "{{quantidade_oferta}}",
                str(quantidade_oferta)
            )

            # ----------------------------------------------------
            # GERACAO OPCIONAL COM IA
            # ----------------------------------------------------
            #
            # O template continua sendo a base e o fallback.
            # A IA recebe somente dados reais disponiveis no lead,
            # campanha e produto.
            #
            # Se a IA estiver indisponivel, sem creditos, retornar
            # erro ou qualquer outra falha ocorrer, mantemos a
            # mensagem original do template.
            # ----------------------------------------------------

            mensagem_template = mensagem
            origem_mensagem = "TEMPLATE"

            if AIMessageService.disponivel():
                try:
                    contexto_ia = f"""
Gere uma mensagem comercial de prospeccao B2B.

Canal: {canal}

Empresa remetente:
{empresa_remetente}

Lead:
Nome: {lead.nome or ""}
Empresa: {lead.empresa or ""}
Cidade: {lead.cidade or ""}
Telefone: {lead.telefone or ""}
Email: {lead.email or ""}

Produto:
Nome: {nome_produto}
Descricao: {descricao_produto}
SKU: {sku_produto}
Preco: {preco_produto}
Preco da oferta: {preco_oferta}
Quantidade da oferta: {quantidade_oferta}

Template base:
{mensagem_template}

Regras:
- Use somente informacoes fornecidas acima.
- Nao invente beneficios, precos, caracteristicas ou dados do lead.
- Mantenha a mensagem curta, natural e profissional.
- Personalize para a empresa e cidade quando essas informacoes estiverem disponiveis.
- Preserve o objetivo comercial do template.
- Nao use explicacoes antes ou depois da mensagem.
- Retorne somente a mensagem final.
""".strip()

                    mensagem_ia = AIMessageService.gerar_mensagem(
                        contexto_ia
                    )

                    if mensagem_ia and mensagem_ia.strip():
                        mensagem = mensagem_ia.strip()
                        origem_mensagem = "IA"

                except Exception as erro_ia:
                    print(
                        f"[CampaignMessageService] IA indisponivel; "
                        f"usando template. Motivo: {erro_ia}"
                    )
                    mensagem = mensagem_template

            # ----------------------------------------------------
            # CRIA MENSAGEM
            # ----------------------------------------------------

            item = CampaignMessage(

                campaign_id=campaign_id,

                lead_id=lead.id,

                template_id=(
                    template.id
                    if template
                    else None
                ),

                canal=canal,

                assunto=assunto,

                mensagem=mensagem,

                origem=origem_mensagem,

                status="CREATED",

                agendado_em=dados.agendado_em,

            )

            db.add(item)

            mensagens.append(item)

        # ========================================================
        # COMMIT
        # ========================================================

        db.commit()

        for item in mensagens:
            db.refresh(item)

        return mensagens, None


    @staticmethod
    def listar(
        db: Session,
        campaign_id: int,
    ):

        return (
            db.query(CampaignMessage)
            .filter(
                CampaignMessage.campaign_id == campaign_id
            )
            .order_by(
                CampaignMessage.created_at.asc()
            )
            .all()
        )


    @staticmethod
    def atualizar_status(
        db: Session,
        message_id: int,
        status: str,
        erro: str | None = None,
    ):

        mensagem = (
            db.query(CampaignMessage)
            .filter(
                CampaignMessage.id == message_id
            )
            .first()
        )

        if not mensagem:
            return None

        mensagem.status = status
        mensagem.erro = erro

        if status == "SENT":
            mensagem.enviado_em = datetime.utcnow()

        db.commit()
        db.refresh(mensagem)

        return mensagem



