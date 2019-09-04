const express = require('express');
const router = express.Router();
const database = require('../data/db');





// using insert, which takes post as a param--post has two required items title and contents
router.post('/', (req, res) => {
    if (!('title' in req.body) || !('contents' in req.body)) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    database.insert({ title: req.body.title, contents: req.body.contents })
        .then(data => res.status(201).json(data))
        .catch(reason => res.status(500).json({ error: "There was an error while saving the post to the database" }))
});


// using insertComment which takes comment as a param 
router.post('/:id/comments', (req, res) => {
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
        })
    });



    router.get('/', (req, res) => {
        database.find()
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ error: "The users information could not be retrieved." }))
    });


    router.get('/:id', (req, res) => {
        database.findById(req.params['id'])
            .then((data) => {
                if (data === undefined) { res.status(404).json({ message: "The post with the specified ID does not exist." }) }
                else {
                    res.status(200).json(data)
                }
            })
            .catch((err) => res.status(500).json({ error: "The post information could not be retrieved." }))
    });

    router.get('/:id/comments', (req, res) => {
        database.findCommentById(req.params['id'])
            .then((data) => {
                if (data === undefined) { res.status(404).json({ message: "The post with the specified ID does not exist." }) }
                else { res.status(200).json(data) }
            })
            .catch((err) => res.status(500).json({ error: "The comments information could not be retrieved." }))
    });

    router.delete('/:id', (req, res) => {
        database.remove(req.params['.id'])
         .then((data) => { 
             if (data === undefined) {
                 res.status(404).json({message: "The post with the specified ID does not exist."})
             } else {res.status(200).json(data)}})
         .catch((err) => res.status(500).json({error: "The post could not be removed."}))
           });
       

           router.put('/:id', (req, res) => {     
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


        module.exports = router;

   