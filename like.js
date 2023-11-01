// LikeButton.js component
import React, { useState, useEffect } from 'react';

const LikeButton = ({ post_id, userId }) => {
  const [likeState, setLikeState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    checkLikeStatus();
  }, [post_id]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`http://ip_address:4000/likes?user_id=${userId}&post_id=${post_id}`);
      if (response.ok) {
        const data = await response.json();
        setLikeState(data.length > 0);
        setLikeCount(data.length);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeClick = async () => {
    const likeAction = likeState ? 'likeDelete' : 'likeInsert';
    try {
      const response = await fetch(`http://ip_address:4000/${likeAction}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, post_id }),
      });
      if (response.ok) {
        setLikeState(!likeState);
        setLikeCount(likeCount + (likeState ? -1 : 1));
      }
    } catch (error) {
      console.error(`Error ${likeAction}ing post:`, error);
    }
  };

  return (
    <Pressable
      onPress={handleLikeClick}
      style={styles.likeButton}
    >
      <FontAwesomeIcon
        name="thumbs-up"
        color={likeState ? '#1195DF' : 'gray'}
        size={20}
      />
      <Text>{likeCount}</Text>
    </Pressable>
  );
};

const styles = {
  likeButton: {
    height: 28,
    width: 90,
    backgroundColor: '#313030',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  },
};

// Create a reusable function for executing SQL queries
function executeQuery(res, query, params, successMessage) {
    con.query(query, params, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query');
      } else {
        console.log(successMessage);
        res.status(200).json(result);
      }
    });
  }
  
  // Likes Route
  app.post('/likes', (req, res) => {
    const { user_id, post_id } = req.body;
    const query = 'SELECT * from likes where post_id=? and user_id=?';
    const params = [post_id, user_id];
    const successMessage = 'Likes data retrieved successfully!';
    executeQuery(res, query, params, successMessage);
  });
  
  // Like Insert Route
  app.post('/likeInsert', (req, res) => {
    const { user_id, post_id } = req.body;
    const query = 'INSERT into likes(post_id,user_id) values(?,?)';
    const params = [post_id, user_id];
    const successMessage = 'Like inserted successfully!';
    executeQuery(res, query, params, successMessage);
  });
  
  // Like Delete Route
  app.post('/likeDelete', (req, res) => {
    const { user_id, post_id } = req.body;
    const query = 'DELETE FROM likes where post_id =? and user_id = ?';
    const params = [post_id, user_id];
    const successMessage = 'Like deleted successfully!';
    executeQuery(res, query, params, successMessage);
  });
  
