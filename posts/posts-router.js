const express = require("express");
const db = require("../data/db");
//notice uppercase R
const router = express.Router(); //invoke Router()
// the router handles endpoints that begin with /api/posts
//router only cares about what comes after /api/posts

//Gets an Array of all post
router.get("/", (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts"
      });
    });
});

//Gets the post object with specific id
router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post"
      });
    });
});

//Gets an array of the comments associated with a specific id
router.get("/:id/comments", (req, res) => {
  db.findCommentById(req.params.id)
    .then(comments => {
      if (comments && comments.length) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post"
      });
    });
});

//Create a post
router.post("/", (req, res) => {
  db.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error inserting the post"
      });
    });
});

//Creates a comment for the post with the specified id

router.post('/:id/comments', (req, res) => {
    const comment = req.body;
    const { text, post_id } = comment;
    console.log(comment);
    if (!text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    } else {
      db.findById(req.params.id);
      db.insertComment(req.body)
        .then(result => {
          db.findCommentById(result.id)
            .then(found => {
              res.status(200).json(found);
            })
            .catch(err => {
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });



//Delete db by ID
router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the post"
      });
    });
});

//Updates the posts with a specific id
router.put("/:id", (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error updating the post"
      });
    });
});

module.exports = router;
