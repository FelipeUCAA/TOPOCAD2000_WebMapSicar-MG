const fs = require('fs').promises;
const path = require('path');

const databases = [
    {
        url: "https://microcad.blob.core.windows.net/confro2000/sicar/MG.zip",
        localPath: path.join(__dirname, "./layers/SICAR_MG_1.js")
    }
    // {...}
];

async function updateAllDatabases() {
    for (const db of databases) {
        try {
            const response = await fetch(db.url);

            if (!response.ok) {
                console.error(`Falha ao acessar o blob: ${db.url}. Status: ${response.status}`);
                continue;
            }

          
            const remoteData = await response.json();

          
            let localData;
            try {
                const localFileData = await fs.readFile(db.localPath, 'utf8');
                localData = JSON.parse(localFileData);
            } catch {
                localData = null; 
            }

            //Comparação_por_diferença
            if (JSON.stringify(localData) !== JSON.stringify(remoteData)) {
                await fs.writeFile(db.localPath, JSON.stringify(remoteData, null, 2));
                console.log(`Database '${db.localPath}' atualizada com sucesso.`);
            } else {
                console.log(`Database '${db.localPath}' já está atualizada.`);
            }

        } catch (error) {
            console.error(`Erro ao atualizar a database '${db.localPath}':`, error);
        }
    }
}


updateAllDatabases();
