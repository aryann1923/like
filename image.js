//first install mutler in your project ,look it up on google on how to install multer
//then include this in your express js server file where all your api post/get requests are situated for instance lets say server.js
const multer = require('multer');

//also install path in your project as you did for multer
const path = require('path');

//install luxon similarly as you did for the above ,then
const {DateTime} = require('luxon');

//after this add this,
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../upload');
  },
  filename: (req, file, cb) => {
    const time = DateTime.now();

    const Filename = time + path.extname(file.originalname);

    req.Filename = Filename;
    cb(null, Filename);
  },
});

//../upload is the location where you want to store the image ,so make a folder called upload in the root directory

//then include this
const pathmera = path.join(__dirname, '../upload');
app.use('/static', express.static(path.join(pathmera)));

const upload = multer({storage: storage});

//then come to the front end ,for instance main.js
import {launchImageLibrary} from 'react-native-image-picker';

//create a state variable to store the details of the image you want to upload 
const [image,setimage] = useState({
    image_uri:'',
    image_name:'',
    image_type:'',
});

//create two pressable buttons for selecting and uploading the image 
<Pressable onPress={selectImage}>select image</Pressable>
<Pressable onPress={uploadImage}>upload image</Pressable>

//the create the font end to initiate the image select and upload 
const selectImage =async () =>{
const select = await launchImageLibrary(
    {mediaType: 'photo'},
    response => {
      if (response.didCancel) {
        console.log('cancelled');
      } else if (response.error) {
        console.log('image not selected:', response.error);
      } else {
        const main_image_setter = response.assets[0];
        setimage({
          ...completePost,
          image_uri: main_image_setter.uri,
          image_name: main_image_setter.fileName,
          image_type: main_image_setter.type,
        });
}

const uploadImage = () =>{
    const formdata = new FormData();
    formdata.append('my_image', {
      uri: image.image_uri,
      name: image.image_name,
      type: image.image_type,
    });
    fetch('http://your_ip_address:4000/upload_image', {
      method: 'POST',
      body: formdata,
      headers: {'Content-Type': 'multipart/form-data'},
    }).then(response=>{
        if(response.ok){
         Alert.alert('success');
        }
    })
}

//this is your api in the express js file 
app.post('/upload_image', upload.single('my_image'), (req, res) => {
    
    const filenaam = '' + req.Filename;
  
    con.query(
      'INSERT INTO my_table(image) values(?)',
      [filenaam],
      (err, result) => {
        if (err) {
          console.error('uploading image failed', err);
        } else {
          console.log('uploaded image successfully ');
  
          res.status(200).json(result);
        }
      },
    );
  });