import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useEffect, useCallback, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ribbon from '../custom/ribbon';
import Des from '../custom/description';
import Post2 from '../custom/post2';
import ProfPicEdit from '../custom/profpicEdit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FFP from '../custom/FFP';
import Bottom from '../custom/bottom-tab';
import Homepost from '../custom/homepost';
import Search from '../custom/searchmodal';

function Home2({navigation, route}) {
  const userid = route.params.userid;
  const profile_pic = route.params.profile_pic;
  const name = route.params.name;
  const course = route.params.course;
  cover_pic = route.params.cover_pic;
  //all post retrieve starts
  const [posts, setposts] = useState([]);
  const [followingData, setfollowingData] = useState([]);
  const [profDes, setprofDes] = useState([]);
  const Followers = String(profDes.map(item => item.Follower));
  const Followings = String(profDes.map(item => item.Following));

  const Posts = String(profDes.map(item => item.Posts));

  console.log('profdes', profDes);

  useEffect(() => {
    fetch('http://192.168.123.7:4000/posts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setposts(json);
        fetch('http://192.168.123.7:4000/profDetails', {
          method: 'POST',

          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: userid}),
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
          })
          .then(json => {
            setprofDes(json);
            fetch('http://192.168.123.7:4000/feedFollowing', {
              method: 'POST',

              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({user_id: userid}),
            })
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
              })
              .then(json => {
                setfollowingData(json);
              });
          });
      });
  }, []);
  console.log('posts-------', posts);
  //all post retrieve ends

  //temporary functions start
  const filterPost = useCallback(
    d => {
      const clear = posts.filter(item => item.post_id !== d);
      setposts(clear);
    },
    [posts, setposts],
  );

  const changePostDetails = useCallback(
    (id, newCaption, newLocation) => {
      const updateDetails = posts.map(item => {
        if (item.post_id === id) {
          return {...item, caption: newCaption, location: newLocation};
        }
        return item;
      });
      setposts(updateDetails);
    },
    [posts],
  );

  const filterArchive = useCallback(
    id => {
      const clearArchive = posts.filter(item => item.post_id !== id);
      posts(clearArchive);
    },
    [posts, setposts],
  );
  //temporary functions ends

  //enlarge initiate starts
  const [enlargeModal, setenlargeModal] = useState(false);
  const [indexNum, setindexNum] = useState(1);

  const enLarge = useCallback(ind => {
    setenlargeModal(true);
    setindexNum(ind);
  }, []);
  //enlarge initiate ends

  //account details and misc starts
  const [accountModal, setaccountModal] = useState(false);

  //account details and misc ends

  //profile pic view starts

  const [profilepicModal, setprofilepicModal] = useState(false);
  //profile pic view ends

  //view people user is following starts
  const [followingLoader, setfollowingLoader] = useState(false);
  const [followingList, setfollowingList] = useState([]);

  const followingRetrieve = () => {
    setfollowingLoader(true);
    fetch('http://192.168.123.7:4000/followingList', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setfollowingList(json);
        setfollowingLoader(false);
      });
  };
  //view people user is following ends

  //view user's followers starts

  const [followerLoader, setfollowerLoader] = useState(false);
  const [followerList, setfollowerList] = useState([]);

  const followerRetrieve = () => {
    setfollowerLoader(true);
    fetch('http://192.168.123.7:4000/followerList', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setfollowerList(json);
        setfollowerLoader(false);
      });
  };

  console.log('followerlist', followerList);
  //view user's followers ends

  //view post timeline starts
  const [postList, setpostList] = useState([]);
  const [postLoader, setpostLoader] = useState(false);

  const postTimeline = () => {
    setpostLoader(true);
    fetch('http://192.168.123.7:4000/postTimeline', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setpostList(json);
        setpostLoader(false);
      });
  };
  //view post timeline ends

  //controls for navigating between followers,following and posts starts
  const [ffp, setffp] = useState(0);
  const [ffpModal, setffpModal] = useState(false);
  //controls for navigating between followers,following and posts ends

  //dark modal for cover starts
  const [darkModal, setdarkModal] = useState(false);
  //dark modal for cover ends

  //remove follower starts
  const [UnRem, setUnRem] = useState(0);
  const [removerId, setremoverId] = useState(0);
  const [removerName, setremoverName] = useState('');
  const [ffpCommandModal, setffpCommandModal] = useState(false);

  const removeFollower = () => {
    fetch('http://192.168.123.7:4000/removeFollower', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid, mate_id: removerId}),
    }).then(response => {
      if (response.ok) {
        const filterFollower = followerList.filter(
          item => item.id != removerId,
        );
        const updatefollowerList = [
          {...profDes[0], Follower: profDes[0].Follower - 1},
        ];
        setprofDes(updatefollowerList);
        setfollowerList(filterFollower);
        setffpCommandModal(false);
      }
    });
  };
  //remove follower ends

  //unfollow starts
  const [unfollowId, setunfollowId] = useState(0);
  const [unfollowName, setunfollowName] = useState(0);
  const removeFollowing = () => {
    fetch('http://192.168.123.7:4000/removeFollowing', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid, mate_id: unfollowId}),
    }).then(response => {
      if (response.ok) {
        const filterFollowing = followingList.filter(
          item => item.id != unfollowId,
        );
        const updatefollowingList = [
          {...profDes[0], Following: profDes[0].Following - 1},
        ];
        setprofDes(updatefollowingList);
        setfollowingList(filterFollowing);
        setffpCommandModal(false);
      }
    });
  };
  //unfollow ends

  //setting modal starts
  const [settingModal, setsettingsModal] = useState(false);
  //setting modal ends

  //switch setting spaces starts

  const [settingScreen, setsettingScreen] = useState(0);
  //switch setting spaces ends

  //name,username and course change edit starts
  const [general, setGeneral] = useState({
    changedName: '',

    changedCourse: '',
  });

  const updateGeneralChanges = () => {
    fetch('http://192.168.123.7:4000/generalChanges', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        changedName:
          general.changedName.length == 0 ? name : general.changedName,
        changedCourse:
          general.changedCourse.length == 0 ? course : general.changedCourse,
        userid: userid,
      }),
    }).then(response => {
      if (response.ok) {
        Alert.alert('success');
        setGeneral({
          changedName: '',
          changedCourse: '',
        });
      }
    });
  };

  //name,username and course change edit ends

  //password change starts
  const [passwordChange, setpasswordChange] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    stall: false,
    confirm: false,
  });

  const passwordCheck = () => {
    fetch('http://192.168.123.7:4000/passwordCheck', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        if (passwordChange.oldPassword == json.map(item => item.password)) {
          setpasswordChange({...passwordChange, stall: false});
          if (passwordChange.newPassword !== passwordChange.confirmPassword) {
            setpasswordChange({...passwordChange, confirm: true});
          } else {
            fetch('http://192.168.123.7:4000/changePassword', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                user_id: userid,
                pass: passwordChange.newPassword,
              }),
            }).then(response => {
              if (response.ok) {
                Alert.alert('changed');
                setpasswordChange({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  stall: false,
                  confirm: false,
                });
              }
            });
          }
        } else {
          setpasswordChange({...passwordChange, stall: true});
        }
      });
  };

  console.log('check', passwordChange);

  const [fontChange, setfontChange] = useState(false);
  const matchPassword = text => {
    setpasswordChange({...passwordChange, confirmPassword: text});
    if (text == passwordChange.newPassword) {
      setfontChange(true);
    } else {
      setfontChange(false);
    }
  };

  //password change ends

  //activity modal starts

  const [activity, setactivity] = useState(0);

  //activity modal ends

  //liked posts section in activty starts

  const [likepostData, setlikepostData] = useState([]);

  const likedPosts = () => {
    setactivity(1);
    fetch('http://192.168.123.7:4000/likedPosts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setlikepostData(json);
      });
  };
  //liked posts section in activty ends

  //saved post section in activity starts
  const [savedpostData, setsavedpostData] = useState([]);

  const savedPost = () => {
    setactivity(2);
    fetch('http://192.168.123.7:4000/savedPost', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setsavedpostData(json);
      });
  };
  //saved post section in activity starts

  //archived post section in activity starts
  const [archivedpostData, setarchivedpostData] = useState([]);
  console.log('tester', archivedpostData);
  const archivedPost = () => {
    setactivity(3);
    fetch('http://192.168.123.7:4000/archivedPost', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setarchivedpostData(json);
      });
  };
  //archived post section in activity ends

  //profile pic change starts

  const [profilepicPreview, setprofilepicPreview] = useState(profile_pic);
  const changeprofilePic = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('cancelled');
      } else if (response.error) {
        console.log('image not selected:', response.error);
      } else {
        const setter = response.assets[0];
        setprofilepicPreview(setter.uri);
        const formdata = new FormData();
        formdata.append('image', {
          uri: setter.uri,
          name: setter.fileName,
          type: setter.type,
        });

        formdata.append('id', String(userid));
        fetch('http://192.168.123.7:4000/upload', {
          method: 'POST',
          headers: {'Content-Type': 'multipart/form-data'},
          body: formdata,
        }).then(response => {
          if (response.ok) {
            Alert.alert('success');
          }
        });
      }
    });
  };
  //profile pic change ends

  //cover pic change starts
  const [coverpicPreview, setcoverpicPreview] = useState(cover_pic);
  const changecoverPic = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('cancelled');
      } else if (response.error) {
        console.log('image not selected:', response.error);
      } else {
        const setter = response.assets[0];
        setcoverpicPreview(setter.uri);
        const formdata = new FormData();
        formdata.append('image', {
          uri: setter.uri,
          name: setter.fileName,
          type: setter.type,
        });

        formdata.append('id', String(userid));
        fetch('http://192.168.123.7:4000/uploadCover', {
          method: 'POST',
          headers: {'Content-Type': 'multipart/form-data'},
          body: formdata,
        }).then(response => {
          if (response.ok) {
            Alert.alert('success');
          }
        });
      }
    });
  };
  //cover pic change

  //search modal starts
  const [SearchModal, setsearchModal] = useState(false);

  //search modal ends

  //search starts
  const [presearchData, setpresearchData] = useState([]);
  const [filteredSearch, setfilteredSearch] = useState([]);
  const initiateSearch = () => {
    fetch('http://192.168.123.7:4000/search')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setpresearchData(json);
      });
  };

  const searchUser = user => {
    sethistoryLoader(true);
    const searchResults = presearchData.filter(item => {
      const resultName = item.name.toLowerCase();
      const searchName = user.toLowerCase();
      return resultName.includes(searchName);
    });
    setfilteredSearch(searchResults);
    sethistoryLoader(false);
  };

  console.log('filtered', filteredSearch);

  const [searchHistoryLoader, sethistoryLoader] = useState(false);
  const historySearch = () => {
    setdarkModal(true);
    setsearchModal(true);

    fetch('http://192.168.123.7:4000/searchHistoryFetch', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({my_id: userid}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(json => {
        setfilteredSearch(json);
        sethistoryLoader(false);
      });
  };

  //search ends

  //navigate user from search starts
  const navigateUser = useCallback(
    (id, course, name, profile_pic, cover_pic) => {
      navigation.navigate('mates2', {
        userid: id,
        my_id: userid,
        profile_pic: profile_pic,
        name: name,
        course: course,
        cover_pic: cover_pic,
      });
      fetch('http://192.168.123.7:4000/searchHistoryInsert', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: id, my_id: userid}),
      }).then(response => {
        if (response.ok) {
          console.log('success');
        }
      });
      setdarkModal(false);
      setsearchModal(false);
    },
    [],
  );
  //navigate user from search ends
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      {/*top bar starts */}
      <View
        style={{
          height: 40,
          width: '100%',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
        }}>
        <TouchableOpacity
          onPress={() => {
            setaccountModal(true);
          }}
          style={{
            height: 40,
            width: 70,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 0,
          }}>
          <FontAwesomeIcon name="bars" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/*top bar ends */}
      {/*cover picture starts  */}
      <ImageBackground
        style={{height: 184, width: '100%'}}
        src={`http://192.168.123.7:4000/static/${cover_pic}`}>
        {/*navigation to people,crimson,settings starts  */}
        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <Ribbon
            people={() => {
              navigation.navigate('people2', {
                people_id: userid,
                profile_pic: profile_pic,
                name: name,
                course: course,
              });
            }}
            crimson={() => {
              navigation.navigate('crimson', {
                userid: userid,
              });
            }}
            settings={() => {
              setsettingsModal(true);
            }}
          />
        </View>
        {/*navigation to people,crimson,settings starts  */}
      </ImageBackground>
      {/*cover picture ends*/}
      {/*name and profile picture space starts*/}
      <View
        style={{
          width: '100%',

          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '100%',
            height: 44,
          }}>
          <View
            style={{
              position: 'absolute',
              right: 148,
              marginTop: 1,

              height: '100%',
            }}>
            <Text style={{fontSize: 16, textAlign: 'right'}}>{name}</Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'right',
                right: 0,
                color: '#953E3E',
                marginTop: 0,
              }}>
              {course}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            setprofilepicModal(true);
          }}
          style={{
            height: 103,
            width: 116,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 13,
            marginTop: -59,
          }}>
          <Image
            src={`http://192.168.123.7:4000/static/${profile_pic}`}
            style={{height: 101, width: 114, objectFit: 'cover'}}
          />
        </Pressable>
      </View>
      {/*name and profile picture space ends*/}
      {/*profile description starts*/}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        {/*Followers starts*/}
        {Followers == 0 ? (
          <Des
            type="Followers"
            onpress={() => {
              followerRetrieve();
              setdarkModal(true);
              setffp(1);
              setffpModal(true);
            }}
          />
        ) : Followers == 1 ? (
          <Des
            type={Followers + ' ' + 'Follower'}
            onpress={() => {
              followerRetrieve();
              setdarkModal(true);
              setffp(1);
              setffpModal(true);
            }}
          />
        ) : Followers > 1 ? (
          <Des
            type={Followers + ' ' + 'Followers'}
            onpress={() => {
              followerRetrieve();
              setdarkModal(true);
              setffp(1);
              setffpModal(true);
            }}
          />
        ) : null}
        {/*Followers ends*/}

        {/*Following starts*/}
        {Followings == 0 ? (
          <Des
            type="Following"
            onpress={() => {
              followingRetrieve();
              setdarkModal(true);
              setffp(2);
              setffpModal(true);
            }}
          />
        ) : Followings == 1 ? (
          <Des
            type={Followings + ' ' + 'Following'}
            onpress={() => {
              followingRetrieve();
              setdarkModal(true);
              setffp(2);
              setffpModal(true);
            }}
          />
        ) : Followings > 1 ? (
          <Des
            type={Followings + ' ' + 'Following'}
            onpress={() => {
              followingRetrieve();
              setdarkModal(true);
              setffp(2);
              setffpModal(true);
            }}
          />
        ) : null}
        {/*Following ends*/}
        {/*Post count starts*/}
        {Posts == 0 ? (
          <Des
            type="Posts"
            onpress={() => {
              postTimeline();
              setdarkModal(true);
              setffp(3);
              setffpModal(true);
            }}
          />
        ) : Posts == 1 ? (
          <Des
            type={Posts + ' ' + 'Post'}
            onpress={() => {
              postTimeline();
              setdarkModal(true);
              setffp(3);
              setffpModal(true);
            }}
          />
        ) : Posts > 1 ? (
          <Des
            type={Posts + ' ' + 'Posts'}
            onpress={() => {
              postTimeline();
              setdarkModal(true);
              setffp(3);
              setffpModal(true);
            }}
          />
        ) : null}
        {/*Post count ends*/}
      </View>
      {/*profile description ends*/}
      {/*posts starts*/}

      <View
        style={{
          marginTop: 10,

          height: '100%',
          width: '100%',
        }}>
        {posts.length !== 0 ? (
          <FlatList
            data={posts}
            keyExtractor={item => item.post_id}
            numColumns={3}
            renderItem={({item, index}) => {
              return (
                <Homepost
                  postImage={item.image}
                  enlarge={enLarge}
                  currentIndex={index}
                  overlay={item.image2}
                />
              );
            }}
          />
        ) : (
          <View
            style={{
              height: 350,

              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>no posts yet</Text>
            <Text style={{color: '#19A6F5'}}>
              go to feed to upload your first post
            </Text>
          </View>
        )}
      </View>

      {/*posts ends*/}
      {/*feed post on click starts */}
      <Modal
        visible={enlargeModal}
        transparent={true}
        onRequestClose={() => {
          setenlargeModal(false);
        }}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <View
            style={{
              height: 45,

              width: '100%',
              flexDirection: 'row',
              borderBottomColor: '#545657',
              borderBottomWidth: 0.5,
            }}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '20%',

                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setenlargeModal(false);
              }}>
              <Feather name={'arrow-left'} size={25} color={'#C1C1C1'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '20%',

                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 0,
              }}>
              <Feather name={'menu'} size={25} color={'#C1C1C1'} />
            </TouchableOpacity>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={posts}
            keyExtractor={item => item.post_id}
            initialScrollIndex={indexNum}
            initialNumToRender={1}
            renderItem={({item, index}) => {
              return (
                <>
                  <Post2
                    name={item.name}
                    profile_pic={item.profile_pic}
                    post_image={item.image}
                    course={item.course}
                    overlay_image={item.image2}
                    caption={item.caption}
                    location={item.location}
                    image_mode={item.image_mode}
                    post_id={item.post_id}
                    userId={userid}
                    like_count={item.like_count}
                    time={item.time}
                    user={item.id}
                    mutuals={item.mutuals}
                    filter={filterPost}
                    edit={changePostDetails}
                    filterArchive={filterArchive}
                    following={followingData}
                    comment_count={item.comment_count}
                  />
                </>
              );
            }}
          />
        </View>
      </Modal>
      {/*feed post on click ends */}
      {/*account details and misc modal starts */}
      <Modal
        visible={accountModal}
        transparent={true}
        onRequestClose={() => {
          setaccountModal(false);
          setactivity(0);
        }}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <View
            style={{
              height: 40,
              width: '100%',

              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                setaccountModal(false);
                setactivity(0);
              }}
              style={{
                height: '100%',
                width: '20%',

                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 0,
              }}>
              <Feather name="arrow-left" size={30} />
            </Pressable>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 18}}>
              Activty
            </Text>
          </View>
          <View
            style={{
              height: '100%',
              width: '100%',

              alignItems: 'center',
            }}>
            {activity !== 0 ? (
              activity == 1 ? (
                <View style={{height: '100%', width: '100%', marginTop: 20}}>
                  <FlatList
                    data={likepostData}
                    numColumns={3}
                    keyExtractor={item => item.post_id}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          style={{
                            height: 145,
                            width: '32.8%',
                            marginLeft: 2,
                            marginTop: 2,
                          }}>
                          <Image
                            src={`http://192.168.123.7:4000/static/${item.image}`}
                            style={{
                              height: 145,
                              width: '100%',
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : activity == 2 ? (
                <View style={{height: '100%', width: '100%', marginTop: 20}}>
                  <FlatList
                    data={savedpostData}
                    numColumns={3}
                    keyExtractor={item => item.post_id}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          style={{
                            height: 145,
                            width: '32.8%',
                            marginLeft: 2,
                            marginTop: 2,
                          }}>
                          <Image
                            src={`http://192.168.123.7:4000/static/${item.image}`}
                            style={{
                              height: 145,
                              width: '100%',
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : activity == 3 ? (
                <View style={{height: '100%', width: '100%', marginTop: 20}}>
                  <FlatList
                    data={archivedpostData}
                    numColumns={3}
                    keyExtractor={item => item.post_id}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          style={{
                            height: 145,
                            width: '32.8%',
                            marginLeft: 2,
                            marginTop: 2,
                          }}>
                          <Image
                            src={`http://192.168.123.7:4000/static/${item.image}`}
                            style={{
                              height: 145,
                              width: '100%',
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : null
            ) : (
              <>
                {/*personal gossips starts */}
                <TouchableOpacity
                  style={{
                    height: '11%',
                    width: '95%',
                    marginTop: '4%',
                    borderRadius: 20,
                    backgroundColor: '#181818',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="coffee" size={35} />
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',

                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: '100%',
                        width: '95%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Gossip
                      </Text>
                      <Text style={{fontSize: 11}}>check out your gossips</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="chevron-right" size={35} />
                  </View>
                </TouchableOpacity>
                {/*personal gossips ends */}
                {/*saved posts starts */}
                <TouchableOpacity
                  onPress={savedPost}
                  style={{
                    height: '11%',
                    width: '95%',
                    marginTop: '4%',
                    borderRadius: 20,
                    backgroundColor: '#181818',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="bookmark" size={35} />
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',

                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: '100%',
                        width: '95%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Saved
                      </Text>
                      <Text style={{fontSize: 11}}>
                        check out bookmarked posts
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="chevron-right" size={35} />
                  </View>
                </TouchableOpacity>
                {/*saved posts ends */}
                {/*archvied posts starts */}
                <TouchableOpacity
                  onPress={archivedPost}
                  style={{
                    height: '11%',
                    width: '95%',
                    marginTop: '4%',
                    borderRadius: 20,
                    backgroundColor: '#181818',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="folder" size={35} />
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',

                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: '100%',
                        width: '95%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Archived
                      </Text>
                      <Text style={{fontSize: 11}}>
                        check out archived posts
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="chevron-right" size={35} />
                  </View>
                </TouchableOpacity>
                {/*archvied posts ends */}
                {/*liked posts view starts */}
                <TouchableOpacity
                  onPress={likedPosts}
                  style={{
                    height: '11%',
                    width: '95%',
                    marginTop: '4%',
                    borderRadius: 20,
                    backgroundColor: '#181818',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="thumbs-up" size={35} />
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',

                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: '100%',
                        width: '95%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Liked
                      </Text>
                      <Text style={{fontSize: 11}}>check out liked posts</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="chevron-right" size={35} />
                  </View>
                </TouchableOpacity>
                {/*liked posts view ends*/}
                {/*commented posts view starts*/}
                <TouchableOpacity
                  style={{
                    height: '11%',
                    width: '95%',
                    marginTop: '4%',
                    borderRadius: 20,
                    backgroundColor: '#181818',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="message-square" size={35} />
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',

                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        height: '100%',
                        width: '95%',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Commented
                      </Text>
                      <Text style={{fontSize: 11}}>
                        check out commented posts
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: '100%',
                      width: '20%',

                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="chevron-right" size={35} />
                  </View>
                </TouchableOpacity>
                {/*commented posts view ends*/}
              </>
            )}
          </View>
        </View>
      </Modal>
      {/*account details and misc modal ends */}
      {/*modal for viewing profile pic starts */}
      <Modal visible={profilepicModal} transparent={true}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <View style={{flex: 1, top: '15%'}}>
            <Image
              src={`http://192.168.123.7:4000/static/${profile_pic}`}
              style={{height: 400, width: '100%'}}
            />
            <ProfPicEdit
              home={() => {
                setprofilepicModal(false);
              }}
              pic_edit={() => {
                navigation.navigate('uploadprof', {
                  id: userid,
                  name: name,
                  profile_pic: profile_pic,
                  course: course,
                });
                setprofilepicModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
      {/*modal for viewing profile pic ends */}
      {/*dark modal for coverup starts */}
      <Modal visible={darkModal} animationType="fade" transparent={true}>
        <Pressable
          style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.9)'}}></Pressable>
      </Modal>
      {/*dark modal for coverup ends */}
      {/* modal for viewing followers,following and posts starts */}
      <Modal
        transparent={true}
        visible={ffpModal}
        animationType="slide"
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: '55%',
            width: '100%',
            backgroundColor: '#181818',
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            elevation: 10,
          }}>
          <View
            style={{
              height: 40,
              width: '100%',

              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              flexDirection: 'row',
              borderBottomWidth: 0.3,
              borderColor: 'gray',

              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                followerRetrieve();
                setffp(1);
                setffpModal(true);
              }}
              style={{
                width: '26.6667%',

                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                borderTopLeftRadius: 30,
              }}>
              <Text style={{color: ffp == 1 ? 'white' : 'gray'}}>
                Followers
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: '26.6667%',

                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
              onPress={() => {
                followingRetrieve();
                setffp(2);
                setffpModal(true);
              }}>
              <Text style={{color: ffp == 2 ? 'white' : 'gray'}}>
                Following
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: '26.6667%',

                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
              onPress={() => {
                postTimeline();
                setffp(3);
                setffpModal(true);
              }}>
              <Text style={{color: ffp == 3 ? 'white' : 'gray'}}>Posts</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setffp(0);
                setffpModal(false);
                setdarkModal(false);
              }}
              style={{
                width: '20%',

                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                borderTopRightRadius: 30,

                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Ionicons name="caret-down-outline" size={20} color="white" />
            </Pressable>
          </View>
          {ffp == 1 ? (
            <View style={{flex: 1}}>
              {followerLoader ? (
                <View
                  style={{
                    height: '100%',
                    width: '100%',

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={'white'} />
                </View>
              ) : followerList.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16}}>no followers yet</Text>
                </View>
              ) : (
                <FlatList
                  data={followerList}
                  key={item => item.name}
                  renderItem={item => {
                    return (
                      <View style={{marginTop: 15, marginLeft: 15}}>
                        <FFP
                          name={item.item.name}
                          course={item.item.course}
                          command={'remove'}
                          image={item.item.profile_pic}
                          remove={() => {
                            setremoverId(item.item.id);
                            setremoverName(item.item.name);
                            setUnRem(1);
                            setffpCommandModal(true);
                          }}
                          mateRedirect={() => {
                            setffpModal(false);
                            setdarkModal(false);
                            navigation.navigate('mates2', {
                              userid: item.item.id,
                              profile_pic: item.item.profile_pic,
                              name: item.item.name,
                              course: item.item.course,
                              cover_pic: item.item.cover_pic,
                              my_id: userid,
                            });
                          }}
                        />
                      </View>
                    );
                  }}
                />
              )}
            </View>
          ) : ffp == 2 ? (
            <View style={{flex: 1}}>
              {followingLoader ? (
                <View
                  style={{
                    height: '100%',
                    width: '100%',

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={'white'} />
                </View>
              ) : followingList.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>you are not following anyone yet</Text>
                </View>
              ) : (
                <FlatList
                  data={followingList}
                  key={item => item.name}
                  renderItem={(item, index) => {
                    return (
                      <View style={{marginTop: 15, marginLeft: 15}}>
                        <FFP
                          name={item.item.name}
                          course={item.item.course}
                          command={'unfollow'}
                          image={item.item.profile_pic}
                          remove={() => {
                            setunfollowId(item.item.id);
                            setunfollowName(item.item.name);
                            setUnRem(2);
                            setffpCommandModal(true);
                          }}
                          mateRedirect={() => {
                            setffpModal(false);
                            setdarkModal(false);
                            navigation.navigate('mates2', {
                              userid: item.item.id,
                              profile_pic: item.item.profile_pic,
                              name: item.item.name,
                              course: item.item.course,
                              cover_pic: item.item.cover_pic,
                              my_id: userid,
                            });
                          }}
                        />
                      </View>
                    );
                  }}
                />
              )}
            </View>
          ) : ffp == 3 ? (
            <View style={{flex: 1}}>
              {postLoader ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color="white" />
                </View>
              ) : postList.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>no posts yet</Text>
                </View>
              ) : (
                <FlatList
                  data={postList}
                  keyExtractor={item => item.post_id}
                  showsVerticalScrollIndicator={false}
                  renderItem={item => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          marginLeft: 10,
                          alignItems: 'center',
                        }}>
                        <Image
                          src={`http://192.168.123.7:4000/static/${item.item.image}`}
                          style={{height: 100, width: 100}}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            right: 70,
                          }}>
                          <Text style={{fontSize: 25}}>
                            {item.item.time.substring(8, 10)}
                            {'-'}
                          </Text>
                          <Text style={{fontSize: 25}}>
                            {item.item.time.substring(5, 7)}
                            {'-'}
                          </Text>
                          <Text style={{fontSize: 25}}>
                            {item.item.time.substring(0, 4)}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          ) : null}
        </View>
      </Modal>
      {/* modal for viewing followers,following and posts ends */}
      {/*unfollow and remove follower modal starts */}
      <Modal transparent={true} visible={ffpCommandModal} animationType="fade">
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <View
            style={{
              height: 80,
              width: '60%',
              backgroundColor: 'white',
              borderRadius: 20,
            }}>
            <View
              style={{
                height: '50%',
                width: '100%',
                borderBottomWidth: 0.2,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomColor: '#BAB2B2',
              }}>
              {UnRem == 1 ? (
                <Text
                  style={{
                    color: 'black',

                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  remove {removerName} ?
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'black',

                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  unfollow {unfollowName} ?
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'row', height: '50%'}}>
              <Pressable
                onPress={() => {
                  setffpCommandModal(false);
                }}
                style={{
                  width: '50%',
                  height: '100%',
                  borderBottomLeftRadius: 20,
                  borderRightWidth: 0.3,
                  borderRightColor: '#BAB2B2',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#47AFC6'}}>NO</Text>
              </Pressable>
              {UnRem == 1 ? (
                <Pressable
                  onPress={removeFollower}
                  style={{
                    width: '50%',

                    height: '100%',
                    borderBottomRightRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'red'}}>Yes</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={removeFollowing}
                  style={{
                    width: '50%',

                    height: '100%',
                    borderBottomRightRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'red'}}>Yes</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
      {/*unfollow and remove follower modal ends */}
      {/*setting modal starts */}
      <Modal
        visible={settingModal}
        transparent={true}
        onRequestClose={() => {
          setsettingsModal(false);
          setsettingScreen(0);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
          }}>
          <View
            style={{
              height: 40,
              width: '100%',

              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                setsettingsModal(false);
                setsettingScreen(0);
              }}
              style={{
                height: '100%',
                width: '20%',

                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 0,
              }}>
              <Feather name="arrow-left" size={30} />
            </Pressable>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 18}}>
              Settings
            </Text>
          </View>

          {settingScreen == 3 ? (
            <View style={{marginTop: 20}}>
              {coverpicPreview != cover_pic ? (
                <ImageBackground
                  style={{height: 184, width: '100%'}}
                  source={{uri: coverpicPreview}}></ImageBackground>
              ) : (
                <ImageBackground
                  style={{height: 184, width: '100%'}}
                  src={`http://192.168.123.7:4000/static/${coverpicPreview}`}></ImageBackground>
              )}

              <View
                style={{
                  width: '100%',

                  height: 103,
                }}>
                <View
                  style={{
                    height: 103,
                    width: 116,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 20,
                    marginTop: -40,
                  }}>
                  {profilepicPreview != profile_pic ? (
                    <Image
                      source={{uri: profilepicPreview}}
                      style={{height: 101, width: 114, objectFit: 'cover'}}
                    />
                  ) : (
                    <Image
                      src={`http://192.168.123.7:4000/static/${profilepicPreview}`}
                      style={{height: 101, width: 114, objectFit: 'cover'}}
                    />
                  )}
                </View>
              </View>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                }}>
                <View
                  style={{
                    marginTop: 20,
                    height: 200,

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={changeprofilePic}
                    style={{
                      height: 30,
                      width: 150,
                      backgroundColor: 'gray',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                    }}>
                    <Text>change profile pic</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={changecoverPic}
                    style={{
                      height: 30,
                      width: 150,
                      backgroundColor: 'gray',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      marginTop: 30,
                    }}>
                    <Text>change cover pic</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 120,
                  marginTop: 10,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 100,
                  }}>
                  <Image
                    src={`http://192.168.123.7:4000/static/${profile_pic}`}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    }}
                  />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 25, color: 'gray'}}>{name}</Text>
                    <Text style={{fontSize: 19, color: 'brown'}}>{course}</Text>
                  </View>
                </View>
              </View>
              {settingScreen == 0 ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  {/*general settings starts*/}
                  <TouchableOpacity
                    onPress={() => {
                      setsettingScreen(1);
                    }}
                    style={{
                      height: '11%',
                      width: '95%',
                      marginTop: '2%',
                      borderRadius: 20,
                      backgroundColor: '#181818',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="sliders" size={35} />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',

                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: '100%',
                          width: '95%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          General
                        </Text>
                        <Text style={{fontSize: 11}}>
                          change name/username and course
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="chevron-right" size={35} />
                    </View>
                  </TouchableOpacity>

                  {/*general setting ends */}
                  {/*display setting starts */}
                  <TouchableOpacity
                    onPress={() => {
                      setsettingScreen(3);
                    }}
                    style={{
                      height: '11%',
                      width: '95%',
                      marginTop: '4%',
                      borderRadius: 20,
                      backgroundColor: '#181818',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="image" size={35} />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',

                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: '100%',
                          width: '95%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          Display
                        </Text>
                        <Text style={{fontSize: 11}}>
                          change profile picture or cover picture
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="chevron-right" size={35} />
                    </View>
                  </TouchableOpacity>
                  {/*display setting ends */}
                  {/*notification setting starts */}
                  <TouchableOpacity
                    style={{
                      height: '11%',
                      width: '95%',
                      marginTop: '4%',
                      borderRadius: 20,
                      backgroundColor: '#181818',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="bell" size={35} />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',

                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: '100%',
                          width: '95%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          Notification
                        </Text>
                        <Text style={{fontSize: 11}}>
                          turn on and off, promotions, alerts, messages
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="chevron-right" size={35} />
                    </View>
                  </TouchableOpacity>
                  {/*notification setting ends */}
                  {/*password setting starts*/}
                  <TouchableOpacity
                    onPress={() => {
                      setsettingScreen(2);
                    }}
                    style={{
                      height: '11%',
                      width: '95%',
                      marginTop: '4%',
                      borderRadius: 20,
                      backgroundColor: '#181818',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="key" size={35} />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',

                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: '100%',
                          width: '95%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          Password
                        </Text>
                        <Text style={{fontSize: 11}}>change password</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="chevron-right" size={35} />
                    </View>
                  </TouchableOpacity>
                  {/*password setting ends*/}
                  {/*privacy setting starts*/}
                  <TouchableOpacity
                    style={{
                      height: '11%',
                      width: '95%',
                      marginTop: '4%',
                      borderRadius: 20,
                      backgroundColor: '#181818',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="lock" size={35} />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',

                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          height: '100%',
                          width: '95%',
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          Privacy
                        </Text>
                        <Text style={{fontSize: 11}}>
                          public and psuedo private account, block, restrict
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '20%',

                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="chevron-right" size={35} />
                    </View>
                  </TouchableOpacity>
                  {/*privacy setting ends*/}
                  {/*logout space starts*/}
                  <View
                    style={{
                      marginTop: 20,
                      height: 100,
                      width: '100%',

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>wanna take a break ?</Text>
                    <TouchableOpacity
                      style={{
                        height: 30,
                        width: 80,
                        borderWidth: 1,
                        borderColor: 'gray',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>Log Out</Text>
                    </TouchableOpacity>
                  </View>
                  {/*logout space ends*/}
                </View>
              ) : settingScreen == 1 ? ( //setting space starts
                <View style={{flex: 1, marginTop: 20}}>
                  <View
                    style={{
                      width: '100%',

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/*name edit starts */}
                    <View
                      style={{
                        width: '90%',
                      }}>
                      <Text>Name</Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                        }}
                        placeholder={name}
                        onChangeText={text => {
                          setGeneral({...general, changedName: text});
                        }}
                      />
                    </View>
                    {/*name edit ends */}
                    {/*username edit starts */}
                    <View
                      style={{
                        width: '90%',
                        marginTop: 25,
                      }}>
                      <Text>Username</Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                        }}
                        placeholder={name}
                      />
                    </View>
                    {/*username edit ends */}
                    {/*course edit starts */}
                    <View
                      style={{
                        width: '90%',
                        marginTop: 25,
                      }}>
                      <Text>Course</Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                        }}
                        placeholder={course}
                        onChangeText={text => {
                          setGeneral({...general, changedCourse: text});
                        }}
                      />
                    </View>
                    {/*course edit ends */}
                    <TouchableOpacity
                      onPress={updateGeneralChanges}
                      style={{
                        height: 30,
                        width: 80,
                        borderWidth: 1,
                        borderColor: 'gray',
                        marginTop: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : settingScreen == 2 ? (
                <View style={{flex: 1, marginTop: 20}}>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '90%',
                      }}>
                      <Text>
                        <Text>old-password</Text>{' '}
                        {passwordChange.stall == true ? (
                          <Text style={{color: 'red'}}> password is wrong</Text>
                        ) : null}
                      </Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                        }}
                        onChangeText={text => {
                          setpasswordChange({
                            ...passwordChange,
                            oldPassword: text,
                          });
                        }}
                        placeholder="type old password"
                      />
                    </View>
                    <View
                      style={{
                        width: '90%',
                        marginTop: 25,
                      }}>
                      <Text>new-password</Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                        }}
                        onChangeText={text => {
                          setpasswordChange({
                            ...passwordChange,
                            newPassword: text,
                          });
                        }}
                        placeholder="type new password"
                      />
                    </View>
                    <View
                      style={{
                        width: '90%',
                        marginTop: 25,
                      }}>
                      <Text>
                        <Text>confirm password</Text>
                        {passwordChange.confirm == true ? (
                          <Text style={{color: 'red'}}>
                            {'   '}
                            does not match with new password
                          </Text>
                        ) : null}
                      </Text>
                      <TextInput
                        style={{
                          height: 40,
                          width: '100%',
                          backgroundColor: 'gray',
                          borderRadius: 10,
                          marginTop: 5,
                          paddingLeft: 10,
                          color: fontChange == true ? 'green' : 'red',
                        }}
                        onChangeText={text => {
                          matchPassword(text);
                        }}
                        value={passwordChange.confirmPassword}
                        placeholder="confirm new password"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={passwordCheck}
                      style={{
                        height: 30,
                        width: 90,
                        borderWidth: 1,
                        borderColor: 'gray',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 35,
                      }}>
                      <Text>change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </>
          )}
        </View>
      </Modal>
      {/*setting modal ends */}

      {/*search modal starts */}
      <Modal
        visible={SearchModal}
        transparent={true}
        showsVerticalScrollIndicator={false}
        animationType="slide"
        onRequestClose={() => {
          setsearchModal(false);
          setdarkModal(false);
        }}>
        <Pressable style={{flex: 1}}>
          <View
            style={{
              height: '80%',
              backgroundColor: '#D3D3D3',
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}>
            <Pressable
              style={{height: '7%'}}
              onPress={() => {
                setsearchModal(false);
                setdarkModal(false);
                setpresearchData([]);
                setfilteredSearch([]);
              }}>
              <View
                style={{
                  height: '100%',
                  width: '30%',

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 17, fontWeight: 'bold', color: 'black'}}>
                  People
                </Text>
              </View>
              <View
                style={{
                  height: '100%',
                  width: '20%',
                  position: 'absolute',
                  right: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesomeIcon name="caret-down" color={'black'} size={40} />
              </View>
            </Pressable>
            <View
              style={{
                height: 30,
                width: '100%',
                backgroundColor: 'gray',
                justifyContent: 'center',
              }}>
              <Text
                style={{marginLeft: 20, color: 'black', fontWeight: 'bold'}}>
                {filteredSearch.length} searches found
              </Text>
            </View>
            {/*search result starts */}
            <View
              style={{
                height: '100%',
                width: '100%',
              }}>
              {searchHistoryLoader == true ? (
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={'gray'} />
                </View>
              ) : (
                <FlatList
                  data={filteredSearch}
                  keyExtractor={item => item.id}
                  renderItem={({item, index}) => {
                    return (
                      <Search
                        id={item.id}
                        name={item.name}
                        profile_pic={item.profile_pic}
                        alias={item.alias}
                        bottoM={filteredSearch.length - 1 == index ? 200 : 0}
                        navigateUser={navigateUser}
                        course={item.course}
                        cover_pic={item.cover_pic}
                        followers={item.follower_count}
                      />
                    );
                  }}
                />
              )}
            </View>

            {/*search result ends */}
            <View
              style={{
                height: 55,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                position: 'absolute',
                bottom: -1,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TextInput
                onFocus={initiateSearch}
                onChangeText={text => {
                  searchUser(text);
                }}
                style={{
                  height: '100%',

                  width: '100%',
                  marginLeft: '10%',
                }}
                placeholder="search user like aryan dalai..."
              />
            </View>
          </View>
        </Pressable>
      </Modal>
      {/*search modal ends */}

      {/*navigation bar starts */}
      <Bottom
        next={{position: 'absolute', bottom: 30, left: 15}}
        home={() =>
          navigation.navigate('feed3', {
            name: name,
            userid: userid,
            profile_pic: profile_pic,
            course: course,
          })
        }
        world={() => {
          navigation.navigate('gossip', {
            name: name,
            userid: userid,
            profile_pic: profile_pic,
          });
        }}
        message={() => {
          navigation.navigate('home', {
            userid: userid,
            profile_pic: profile_pic,
            course: course,
            name: name,
          });
        }}
        search={historySearch}
      />
      {/*navigation bar ends */}
    </View>
  );
}
export default Home2;
