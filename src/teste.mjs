import dotenv from 'dotenv'
import licitacoesJOB from "./jobs/licitacoesJOB.mjs";

dotenv.config();
const numeros = process.env.NUMEROMENSSAGENS.split(',');

teste();

async function teste (){

    const mensagem = await licitacoesJOB();
    if (mensagem) {
        numeros.forEach(numero => {
            console.log(
                numero
            );
        });
    }

}