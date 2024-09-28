// PushEvent | IssuesEvent onde o campo action seja opened | WatchEvent
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Qual é o teu nome de usuario do GitHub? ', (answer) => {
    if(answer === '') {
        console.log('digite o seu nome de usuario phá.!');
        rl.close()
        return
    } 
    githubUserActivity(answer)
    rl.close();
});

async function githubUserActivity(username) {
    let commits = [];
    let openIssue = [];
    let starred = [];
    try {
        const data = await fetch(`https://api.github.com/users/${username}/events`)
        const response = await data.json()

        for (const event of response) {
            if (event['type'] === 'PushEvent') {
                for (const commit of event.payload.commits) {
                    commits.push(commit.message)
                }
            }
            
            if (event.type === 'IssuesEvent') {
                openIssue.push(event.payload.action === 'opened')
            }
            
            if (event['type'] === 'WatchEvent') {
                starred.push(event['type'] === 'WatchEvent')
            }
        }
        
        outputTerminal(commits, openIssue, starred)
        
    } catch (error) {
        console.error(`Ocorreu um erro, tente novamente mais tarde.! - ${error}`);
    }    
}

function outputTerminal(commits, issue, star) {
    if (commits.length === 0) {
        console.log('Nenhum commit feito');
    } else {
        console.log('Commits:');
        for (let index = 0; index < 3; index++) {
            console.log(commits[index])
        }
    }
    console.log('--------------//--------------');
    if (issue.length === 0) {
        console.log('Nenhuma Issue aberta');
    } else {
        console.log(`Foi aberta ${issue.length} issue`);
    }
    console.log('--------------//--------------');
    if (star.length === 0) {
        console.log('Nenhum repositorio com estrela');
    } else {
        console.log(`${star.length} repositorios com estrela`);
    }
}

// https://roadmap.sh/projects/github-user-activity