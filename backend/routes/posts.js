const { json } = require("express");
const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const PostModel = require("../models/PostModel");

router.get("/", authorize, (request, response) => {
  // Endpoint to get posts of people that currently logged in user follows or their own posts

  PostModel.getAllForUser(request.currentUser.id, (postIds) => {
    if (postIds.length) {
      PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
        response.status(201).json(posts);
      });
      return;
    }
    response.json([]);
  });
});

router.post("/", authorize, (request, response) => {
  const post = request.body;
  const userId = request.currentUser.id;
  PostModel.create({ userId, ...post }, () => {
    console.log("Created new post");
    response.json({
      ok: true,
    });
  });
});

router.put("/:postId/likes", authorize, (request, response) => {
  // Endpoint for current user to like a post
  const postId = request.params.postId;
  const userId = request.currentUser.id;

  PostModel.like(userId, postId, () => {
    console.log("Post liked");
    response.json({
      liked: true,
    });
  });
});

router.delete("/:postId/likes", authorize, (request, response) => {
  // Endpoint for current user to unlike a post
  const postId = request.params.postId;
  const userId = request.currentUser.id;

  PostModel.unlike(userId, postId, () => {
    console.log("Post unliked");
    response.json({
      liked: false,
    });
  });
});

module.exports = router;
