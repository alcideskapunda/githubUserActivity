const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What is your GitHub username? ', (answer) => {
    if(answer === '') {
        console.log('enter your username pls.!');
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
        console.error(`An error occurred, please try again later.! - ${error}`);
    }    
}

function outputTerminal(commits, issue, star) {
    if (commits.length === 0) {
        console.log('No commits made');
    } else {
        console.log('Commits:');
        for (let index = 0; index < 3; index++) {
            console.log(commits[index])
        }
    }
    console.log('--------------//--------------');
    if (issue.length === 0) {
        console.log('No Issues open');
    } else {
        console.log(`${issue.length} issues were opened`);
    }
    console.log('--------------//--------------');
    if (star.length === 0) {
        console.log('No starred repositories');
    } else {
        console.log(`${star.length} starred repositories`);
    }
}