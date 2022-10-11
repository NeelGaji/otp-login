import {React, useEffect} from "react";
import {useState} from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { ref, uploadBytes, getDownloadURL, listAll} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";

const Home = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const imagesListRef = ref(storage, "images/");

  //upload file
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };   

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  // c
  return (
    <>
      <div className="p-4 box mt-3 text-center">
        Hello Welcome <br />
        {user.number && user.email}
      </div>
      {/* FORM HERE */}
      <div className="form-imput">
        <div className="my-1 mx-5">
        <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
        </div>
        <div className="mx-5">
        <button onClick={uploadFile}> Upload Image</button></div>
      <div className="images-div">
      {imageUrls.map((url) => {
        return <img src={url}  className="img-upload"/>;
      })}
        
      </div>
      </div>
      {/*here */}
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default Home;
