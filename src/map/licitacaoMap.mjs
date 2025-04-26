import { JSDOM } from 'jsdom';

function mapearLicitacao(html) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const licitacoes = [];

    // Seleciona todos os blocos de licitação
    const listas = doc.querySelectorAll('ul');

    listas.forEach(lista => {
        const codigo = lista.querySelector('.codigo a')?.textContent.trim() || '';
        const tituloLic = lista.querySelector('.tituloLic a')?.textContent.trim() || '';
        const data = lista.querySelector('.data')?.textContent.trim() || '';
    
        // Seleciona todos os elementos com a classe "categroria"
        const categorias = lista.querySelectorAll('.categroria');
    
        // Busca o script de "Natureza" no primeiro elemento "categroria"
        const naturezaScript = categorias[0]?.querySelector('script')?.textContent || '';
        const naturezaMatch = naturezaScript.match(/\/SESC\/NATUREZA\/([^';]+)/);
        const natureza = naturezaMatch ? naturezaMatch[1].trim() : '';
    
        // Busca o script de "Categoria" no segundo elemento "categroria"
        const categoriaScript = categorias[1]?.querySelector('script')?.textContent || '';
        const categoriaMatch = categoriaScript.match(/\/SESC\/CATEGORIA\/([^';]+)/);
        const categoria = categoriaMatch ? categoriaMatch[1].trim() : '';
    
        const situacaoScript = lista.querySelector('.situacao script')?.textContent || '';
        const situacaoMatch = situacaoScript.match(/\/SESC\/SITUAÇÃO_LICITAÇÃO\/([^';]+)/);
        const situacao = situacaoMatch ? situacaoMatch[1].trim() : '';
    
        // Cria uma nova instância de Licitacao
        const licitacao = {
            codigo,
            tituloLic,
            data,
            natureza,
            categroria: categoria,
            situacao,
        };
    
        licitacoes.push(licitacao);
    });

    return licitacoes;
}

export default mapearLicitacao;