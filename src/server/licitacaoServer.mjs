import mapearLicitacao from "../map/licitacaoMap.mjs";

class LicitacaoServer {


    getLicitacoes() {
        var myHeaders = new Headers();
        myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
        myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("cache-control", "max-age=0");
        myHeaders.append("if-none-match", "\"-1180966412\"");
        myHeaders.append("priority", "u=0, i");
        myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("sec-fetch-dest", "document");
        myHeaders.append("sec-fetch-mode", "navigate");
        myHeaders.append("sec-fetch-site", "none");
        myHeaders.append("sec-fetch-user", "?1");
        myHeaders.append("upgrade-insecure-requests", "1");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36");
        myHeaders.append("Cookie", "_ga=GA1.3.1082484110.1745684293; _gid=GA1.3.1434994548.1745684293; _ga_7PD9L4LTRM=GS1.3.1745684293.1.1.1745685807.60.0.0");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        return fetch("https://www2.sesc.com.br/portal/sesc/departamentonacional/licitacoes/licitacoes+em+andamento", requestOptions)
            .then(response => response.text())
            .then(result => mapearLicitacao(result))
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

}

export default new LicitacaoServer();