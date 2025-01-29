import "./profile.css"
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import { deleteUser, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  //States for edit
  const [updateOn, setUpdateon] = useState(false);

  // States for individual fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");

  const navigate = useNavigate();

  //Function to fetch particular user data
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, "auth-crud-app", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setUserData(docSnap.data());
      } else {
        console.log("No user found.");
      }
    } catch (error) {
      console.log("Error getting document:", error.message);
    }
  };

  //Function to update data
  const updateUserdata = async (fname, lname, age) => {
    if (!fname || !lname || !age) {
      alert("You cannot leave any field empty.");
    }
    else{
      try{
        const updateUser = auth.currentUser.uid ;
        const docRef = doc(db, "auth-crud-app", updateUser );
        await updateDoc(docRef,{
          fname,
          lname,
          age
        });

        fetchUserData(updateUser) // fetch new data
        setUpdateon(false);
      }
      catch(err){
        console.log(err.message);
      }
    }
  };
  //Function to delete account
  const handleDelete = async() =>{
    try{
      await deleteDoc(doc(db,'auth-crud-app', auth.currentUser.uid ))
      console.log("#1. User document deleted.")

      await deleteUser(auth.currentUser)
      console.log("#2. User account deleted")

      alert("User deleted successfully!")
      navigate('/');
    }catch(err){
      console.log(err.message);
    }
  }


  //For tracking auth status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log("User is logged in", currentUser.uid);
        fetchUserData(currentUser.uid);
      } else {
        console.log("User is not logged in.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  //Pages displays
  if (loading) {
    return <div>Loading ...</div>;
  }

  if (!userData) {
    return (
      <div>
        User is not logged in. Please <a href="/">Log in</a>{" "}
      </div>
    );
  }

  return (
    <div>
      {!updateOn ? (
        <>
          <h2>👋 Welcome {userData.fname}</h2>
          <h3>User info</h3>
          <ul>
            <li>First Name: {userData.fname}</li>
            <li>Last Name: {userData.lname}</li>
            <li>Age: {userData.age}</li>
            <li>Email: {userData.email}</li>
          </ul>
          
          <button onClick={() => setUpdateon(true)}>Edit info</button>
          <button onClick={handleDelete}>Delete Account</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div>
          <h3>Edit user info:</h3>
          <ul>
            <li>
              First Name
              <input
                type="text"
                placeholder={userData.fname}
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </li>
            <li>
              Last Name
              <input
                type="text"
                placeholder={userData.lname}
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </li>
            <li>
              Age
              <input
                type="number"
                placeholder={userData.age}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </li>
          </ul>
          <button onClick={() => setUpdateon(false)}>Back</button>
          <button onClick={() => updateUserdata(fname, lname, age)}>
            Update
          </button>
        </div>
      )}
    </div>
  );
}
