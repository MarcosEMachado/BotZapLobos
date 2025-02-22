import dotenv from 'dotenv'
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import cron from 'node-cron';
import eventoServer from './server/eventoServer.mjs';
import moment from 'moment-timezone';


dotenv.config();
const { NOMEGRUPO } = process.env;
var idChatGrupo;

const client = new Client({
    authStrategy: new LocalAuth()
});

// Se o cliente logou
client.once('ready', async () => {
    console.log('Client is ready!');
    await client.getChats().then((chats) => {
        idChatGrupo = chats.find(c => c.name == NOMEGRUPO);
        console.log(`o Id do Grupo ${idChatGrupo.id._serialized}`);
    });
});

// Gerar o GR code para autenticar o zap
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Start your client
client.initialize();


cron.schedule('30 13 * * 1', () => {
    console.log(`${moment().tz('America/Sao_Paulo').format('DD/MM/YYYY')} Executando a tarefa de enviar mensagem para o grupo ${NOMEGRUPO}`);
    if (idChatGrupo) {
        client.sendMessage(
            idChatGrupo.id._serialized,
            'Edu viadooo'
        )
    }
});

cron.schedule('0 21 * * 5', () => {
    console.log(`${moment().tz('America/Sao_Paulo').format('DD/MM/YYYY')} Executando a tarefa de enviar mensagem para o grupo ${NOMEGRUPO}`);
    if (idChatGrupo) {
        getEvento((envento) => {
            if (envento) {
                const start = envento.start.dateTime || envento.start.date;
                const data = moment(start).tz('America/Sao_Paulo').format('DD/MM/YYYY');
                client.sendMessage(
                    idChatGrupo.id._serialized,
                    `Lembrando que no Domingo ${data} tem ${envento.summary}`
                );
            }
        });
    }
});

function getNextSaturday() {
    const today = moment().tz('America/Sao_Paulo');
    const nextSaturday = today.clone().day(6);
    if (today.day() >= 6) {
        nextSaturday.add(1, 'week');
    }
    return `${nextSaturday.format('YYYY-MM-DD')}T00:00:00.000Z`;
}

function getNextMonday() {
    const today = moment().tz('America/Sao_Paulo');
    const nextMonday = today.clone().day(1);
    if (today.day() >= 1) {
        nextMonday.add(1, 'week');
    }
    return `${nextMonday.format('YYYY-MM-DD')}T00:00:00.000Z`;
}

function getEvento(callback) {
    const nextSaturday = getNextSaturday();
    const nextMonday = getNextMonday();
    eventoServer.listEvents(nextSaturday, nextMonday)
        .then(events => {
            const event = events.find(e => e.summary.toUpperCase().includes('TREINO'));
            callback(event);
        })
        .catch(error => {
            console.error('Erro ao obter eventos:', error);
            callback(undefined);
        });
}