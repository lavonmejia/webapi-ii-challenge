const express = require('express');
const database = require('./data/db');

const server = express();

server.use(express.json()) // for parsing application/json
server.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// using insert, which takes post as a param--post has two required items title and contents
server.post('/api/posts', (req, res) => {
    if (!('title' in req.body) || !('contents' in req.body)) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    database.insert({ title: req.body.title, contents: req.body.contents })
        .then(data => res.status(201).json(data))
        .catch(reason => res.status(500).json({ error: "There was an error while saving the post to the database" }))
});


// using insertComment which takes comment as a param 
server.post('/api/posts/:id/comments', (req, res) => {
    database.insert({ text: req.body.text, post_id: req.body.post_id })

        .then((data) => {
            if (!('post_id' in req.body)) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }

            else {
                res.status(201).json(data)
            }
        })
        .catch(err => {
            if (!('text' in req.body)) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
            else (res.status(500).json({ error: "There was an error while saving the comment to the database" }))
        });



    server.get('/api/posts', (req, res) => {
        database.find()
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ error: "The users information could not be retrieved." }))
    });


    server.get('/api/posts/:id', (req, res) => {
        database.findById(req.params['id'])
            .then((data) => {
                if (data === undefined) { res.status(404).json({ message: "The post with the specified ID does not exist." }) }
                else {
                    res.status(200).json(data)
                }
            })
            .catch((err) => res.status(500).json({ error: "The post information could not be retrieved." }))
    });

    server.get('/api/posts/:id/comments', (req, res) => {
        database.findCommentById(req.params['id'])
            .then((data) => {
                if (data === undefined) { res.status(404).json({ message: "The post with the specified ID does not exist." }) }
                else { res.status(200).json(data) }
            })
            .catch((err) => res.status(500).json({ error: "The comments information could not be retrieved." }))
    });

    server.delete('/api/posts/:id', (req, res) => {
        database.remove(req.params['.id'])
         .then((data) => { 
             if (data === undefined) {
                 res.status(404).json({message: "The post with the specified ID does not exist."})
             } else {res.status(200).json(data)}})
         .catch((err) => res.status(500).json({error: "The post could not be removed."}))
           });
       

           server.put('/api/posts/:id', (req, res) => {     
            database.update(req.params['.id'], {title: req.body.title, contents: req.body.contents})
            .then((data) => {
                if (data === undefined) {
                    res.status(404).json({message:"The post with the specified ID does not exist."})
                } else  if ((!('title' in req.body) || !('contents' in req.body))){
                    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
                } else {res.status(200).json(data)}
                })
            .catch((err) => res.status(500).json({error: "The post information could not be modified."}))
        })    

    server.listen(8000, () => console.log('API running on port 8000'));