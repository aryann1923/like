//follow the codes as given

const {TextInput} = require('react-native-gesture-handler');

//make these changes in input.js file

<TextInput
  onChangeText={text => {
    setinput({...input, name: text});
  }}
/>;

//similarly do the above code for all the other text inputs

// dont inport the save button component in addtodo.js file ,instead import it in the input.js file

//add a prop to the save button

<TouchableOpacity style={{height: 30, width: 100}} onPress={saveData}>
  <Text
    style={{
      fontSize: 30,
      fontFamily: 'PlaypenSans-Bold',
      alignSelf: 'center',
    }}>
    SAVE
  </Text>
</TouchableOpacity>;

//add input.js as a screen as well in the routes.js ,dont forget

//then add a const in input.js file 
<SaveButton saveData={saveData}/>

const Input = ({navigation}) =>{
    const saveData = () =>{
        navigation.navigate('to the screen you want to navigate',{
            name:input.name,
            email:input.email,
            number:input.phonenumber,
            description:input.description
        });
    }
return (

)
}

//then in the screen where you want to receive these data ,i am guessing todo.js screen ,then do this


const Todo=({route,navigation})=> {
    const name = route.params.name;
    const email = route.params.email;
    const number = route.params.number;
    const description = route.params.description;

    //console.log to check whether the data has travelled
    console.log('name->',name);
}


