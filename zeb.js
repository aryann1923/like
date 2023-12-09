import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {useState, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

function Zhome() {
  const [data, set_data] = useState([
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
  ]);

  const [search, set_search] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [offset, setOffset] = useState(0);

  console.log(scrollDirection);

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset > offset ? 'down' : 'up';

    // Update the scroll direction only if it has changed
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }

    // Update the offset
    setOffset(currentOffset);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <ImageBackground
        style={{height: '100%', width: '100%'}}
        source={require('../assets/mesh2.png')}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(247,244,244,0.8)',
          }}>
          {/*====search bar starts==== */}
          {scrollDirection == 'up' ? (
            <View
              style={{
                height: 50,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '6%',
                position: 'absolute',
                zIndex: 2,
              }}>
              <View
                style={{
                  height: 50,
                  width: '90%',
                  backgroundColor: '#FFF',
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                }}>
                <View
                  style={{
                    height: '100%',
                    width: '20%',

                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    justifyContent: 'center',
                    position: 'absolute',
                    left: 0,
                  }}>
                  <Image
                    source={require('../assets/eu.webp')}
                    style={{
                      height: 45,
                      width: 45,
                      marginLeft: '5%',
                      borderRadius: 10,
                    }}
                  />
                </View>
                <TextInput
                  style={{
                    height: '100%',
                    width: '60%',

                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    color: 'gray',
                  }}
                  placeholder="search"
                  placeholderTextColor={'gray'}
                  cursorColor={'gray'}
                />
                <View
                  style={{
                    height: '100%',
                    width: '20%',

                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Image
                    source={require('../assets/mesh2.png')}
                    style={{
                      height: 45,
                      width: 45,
                      position: 'absolute',
                      right: '5%',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </View>
            </View>
          ) : null}

          {/*====search bar ends==== */}

          {/*====Property box starts==== */}
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            onScroll={handleScroll}
            ListHeaderComponent={
              <>
                <Text
                  style={{
                    marginTop: '19%',
                    marginLeft: '4%',
                    color: '#004F84',
                    fontWeight: 700,
                    fontSize: 32,
                    zIndex: 1,
                  }}>
                  Spaces
                </Text>
              </>
            }
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    height: 140,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: index == data.length - 1 ? 100 : 0,
                    marginTop: 20,
                    zIndex: 1,
                  }}>
                  <View
                    style={{
                      height: 140,
                      width: '94%',
                      borderRadius: 10,
                      backgroundColor: 'white',
                    }}>
                    {/*Title of property starts */}
                    <View
                      style={{
                        height: '40%',
                        width: '100%',

                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontSize: 28,
                          fontWeight: 600,
                          color: '#004F84',
                        }}>
                        Prestige Heights
                      </Text>
                    </View>
                    {/*Title of property ends */}
                    {/*no. of flats starts */}
                    <View
                      style={{
                        height: '15%',
                        width: '100%',

                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: -10,
                      }}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontSize: 14,
                          color: '#557184',
                        }}>
                        460 flats
                      </Text>
                      <View
                        style={{
                          height: 2,
                          width: 2,
                          backgroundColor: '#557184',
                          marginLeft: 10,
                        }}></View>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 14,
                          color: '#557184',
                        }}>
                        3 km
                      </Text>
                    </View>
                    {/*no. of flats ends */}
                    <View
                      style={{
                        height: '25%',

                        width: '100%',
                        marginTop: 5,
                      }}>
                      <View
                        style={{
                          height: '50%',
                          width: '100%',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            marginLeft: 15,
                            color: '#557184',
                          }}>
                          Min <Text style={{fontWeight: 'bold'}}>rs 700</Text> -
                          Campaign Type
                        </Text>
                      </View>
                      <View
                        style={{
                          height: '50%',
                          width: '100%',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            marginLeft: 15,
                            color: '#557184',
                          }}>
                          Max <Text style={{fontWeight: 'bold'}}>rs 9000</Text>{' '}
                          - Campaign Type
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: '20%',
                        width: '100%',

                        flexDirection: 'row',

                        alignItems: 'center',
                      }}>
                      <FontAwesomeIcon
                        name="percent"
                        style={{marginLeft: 15, color: 'rgba(85, 113, 132, 1)'}}
                        size={10}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          color: 'rgba(85, 113, 132, 1)',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        1 offer{'   '}
                      </Text>
                      <Text style={{color: '#557184', fontSize: 12}}>&</Text>
                      <Feather
                        name="check-circle"
                        style={{marginLeft: 10, color: 'rgba(85, 113, 132, 1)'}}
                        size={10}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          color: 'rgba(85, 113, 132, 1)',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        2 deals
                      </Text>
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#557184',
                          fontSize: 12,
                        }}>
                        already in place for you
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          {/*====Property box ends==== */}
          {/*====BottomBar starts==== */}
          <View
            style={{
              height: 70,
              width: '100%',
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              flexDirection: 'row',
              elevation: 10,
              borderTopColor: 'gray',
            }}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '33.33%',

                borderTopLeftRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesomeIcon
                name="home"
                color="rgba(85, 113, 132, 1)"
                size={25}
              />
              <Text
                style={{color: 'rgba(85, 113, 132, 1)', fontWeight: 'bold'}}>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '33.33%',

                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="percent" color="rgba(85, 113, 132, 1)" size={25} />
              <Text
                style={{color: 'rgba(85, 113, 132, 1)', fontWeight: 'bold'}}>
                Offers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '33.33%',

                borderTopRightRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather
                name="check-circle"
                color="rgba(85, 113, 132, 1)"
                size={25}
              />
              <Text
                style={{color: 'rgba(85, 113, 132, 1)', fontWeight: 'bold'}}>
                Deals
              </Text>
            </TouchableOpacity>
          </View>
          {/*====BottomBar ends==== */}
        </View>
      </ImageBackground>
    </View>
  );
}
export default Zhome;
