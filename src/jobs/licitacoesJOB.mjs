import licitacaoServer from "../server/licitacaoServer.mjs";

var listLicitacoes = [];
var linkBase = "https://www2.sesc.com.br/portal/sesc/departamentonacional/licitacoes/registros/";

async function licitacoesJOB() {
    try {
        const licitacoes = await licitacaoServer.getLicitacoes();
        console.log(`Obtivemos ${licitacoes.length} licitações`);
        
        const novasLicitacoes = licitacoes.filter(
            licitacao => !listLicitacoes.some(
                antiga => antiga.codigo === licitacao.codigo
            )
        );

        if (novasLicitacoes.length === 0) {
            console.log("Nenhuma nova licitação encontrada.");
            return null; // Retorna null se não houver novas licitações
        }
        
        let mensagem = `Novas licitações: \n`;
        novasLicitacoes.forEach(licitacao => {
            mensagem += `Código: ${licitacao.codigo}\n`;
            mensagem += `Título: ${licitacao.tituloLic}\n`;
            mensagem += `Data: ${licitacao.data}\n`;
            mensagem += `Categoria: ${licitacao.categroria}\n`;
            mensagem += `Situação: ${licitacao.situacao}\n`;
            const tituloSemAcentos = licitacao.tituloLic
                .replace(/[,\-().:;]/g, '')
                .replace(/  /g, ' ')
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]/g, "+");
            const link = `${linkBase}${licitacao.codigo.replace(/[^a-zA-Z0-9]/g, "+")}++${tituloSemAcentos.replace(/[^a-zA-Z0-9]/g, "+")}`;
            mensagem += `Link: ${link.toLowerCase()}\n\n`;
        });

        // Atualiza a lista de licitações
        listLicitacoes = licitacoes;

        return mensagem;
    } catch (error) {
        console.error("Erro ao obter licitações:", error);
        return null; // Retorna null em caso de erro
    }
}

function iniciarListaLicitacoes() {
    licitacaoServer.getLicitacoes()
        .then(licitacoes => {
            listLicitacoes = licitacoes;
            console.log(`Lista de licitações inicializada com ${listLicitacoes.length} itens.`);
        })
        .catch(error => {
            console.error("Erro ao inicializar lista de licitações:", error);
        });
}

export default { licitacoesJOB, iniciarListaLicitacoes };