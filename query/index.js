const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  console.log('Handling event...');
  console.log('type: ', type);
  console.log('data: ', data);
  switch (type) {
    case 'PostCreated':
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;

    case 'CommentCreated':
      const { id: commentId, content, postId, status } = data;
      const post = posts[postId];
      post.comments.push({ id: commentId, content, status });
      break;

    case 'CommentUpdated':
      const {
        id: updatedCommentId,
        content: updatedContent,
        postId: updatedPostId,
        status: updatedStatus,
      } = data;
      const updatedPost = posts[updatedPostId];
      const comment = updatedPost.comments.find(
        (comment) => comment.id === updatedCommentId,
      );
      comment.status = updatedStatus;
      comment.content = updatedContent;
      break;

    default:
      break;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Query service listening on 4002...');

  const res = await axios.get('http://event-bus-srv:4005/events');

  for (const event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
