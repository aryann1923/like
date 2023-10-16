//this is the pressable button basically the like button
<Pressable
  onPress={() => {
    post_like(post_id);
  }}
  style={{
    height: 28,
    width: 90,
    backgroundColor: '#313030',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  }}>
  <FontAwesomeIcon
    name={'thumbs-up'}
    color={likeState.includes(post_id) ? '#1195DF' : 'gray'}
    size={20}
  />
  <Text>{Like_Count}</Text>
</Pressable>;

//these are the state variable
const [likeState, setlikeState] = useState([]);
const [Like_Count, setLikeCount] = useState('');

//this is the like function
const post_like = Post_id => {
  const ids = {user_id: userId, post_id: Post_id};
  fetch('http://ip_address:4000/likes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(ids),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      if (json.length == 0) {
        setlikeState(prev => {
          return [...prev, Post_id];
        });
        setLikeCount(prev => {
          return prev + 1;
        });
        fetch('http://ip_address:4000/likeInsert', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(ids),
        });
      } else {
        setlikeState(prev => {
          return prev.filter(item => item !== Post_id);
        });
        setLikeCount(prev => {
          return prev - 1;
        });
        fetch('http://ip_address:4000/likeDelete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(ids),
        });
      }
    });
};

//explaination of the above code :
//ids is basically user_id and post_id which is basically the my id ie.the person who is liking the post and post_id is basically the id of the post i am liking
//then i create a fetch api to send the ids
//so the first fetch api check whether a row with the same user_id and post_id exist or not
//if a row does not exist ,then it updates the like state and increases the like count and the send a fetch api to insert the user id and post id
//if a row already exists ,then it updated the like state and decreses the count by 1 and then sends a fetch api to delete the row

//below are the api requests in the express server file,the requests are being made to a mysql database
app.post('/likes', (req, res) => {
  const {user_id, post_id} = req.body;
  con.query(
    'SELECT * from likes where post_id=? and user_id=?',
    [post_id, user_id],
    (err, result) => {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
      } else {
        console.log('Data retrieved successfully!');
        res.status(200).json(result);
      }
    },
  );
});

app.post('/likeInsert', (req, res) => {
  const {user_id, post_id} = req.body;

  con.query(
    'INSERT into likes(post_id,user_id) values(?,?)',
    [post_id, user_id],
    (err, result) => {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
      } else {
        console.log('Data retrieved successfully!');
        res.status(200).json(result);
      }
    },
  );
});

app.post('/likeDelete', (req, res) => {
  const {user_id, post_id} = req.body;
  con.query(
    'DELETE FROM likes where post_id =? and user_id = ?',
    [post_id, user_id],
    (err, result) => {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
      } else {
        console.log('Data retrieved successfully!');
        res.status(200).json(result);
      }
    },
  );
});
