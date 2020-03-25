const express = require('express');

const server = express();

server.use(express.json());

const projects = []; 

function checkProjectExists(req, resp, next) {
    const { id } = req.params;
    const project = projects.find(project => project.id == id);
    if(!project) {
        return resp.status(400).json({error: `Project ${id} not found`});
    }
    return next();
} 

server.use((req, resp, next) => {
    console.count("Número de requisições");
    return next();
});

server.post('/projects', (req, resp) => {
    const { id, title, tasks } = req.body;
    const project = {
        id,
        title,
        tasks
    };
    projects.push(project);
    return resp.json(projects); 
});

server.get('/projects', (req, resp) => {
    return resp.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, resp) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(project => project.id == id);
    if(project) {
        project.title = title;
    }
    return resp.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, resp) => {
    const { id } = req.params;
    const index = projects.findIndex(project => project.id == id);
    if(index >= 0) {
        projects.splice(index, 1);
    }
    return resp.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, resp) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(project => project.id == id);
    if(project) {
        project.tasks = project.tasks || [];
        project.tasks.push(title);
    }
    return resp.json(projects);
});

server.listen(1985);