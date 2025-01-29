import "./homepage.css";
import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function Homepage() {
  // States and function for switching between sign in and sign up
  const [isSignupEnabled, setIsSignupEnabled] = useState(false);
  const handleSwitch = () => {
    setIsSignupEnabled(!isSignupEnabled);
  };

  const collectionRef = collection(db, "auth-crud-app");
  const navigate = useNavigate();

  // States for user data
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle signup
  const handleSignup = async (e, fname, lname, age, email, password) => {
    e.preventDefault();

    if (!fname || !lname || !age || !email || !password) {
      alert("Please fill all the fields!");
      return;
    } else {
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCred.user;

        alert("Account created succesfully!");
        console.log("User account created with ID:", user.uid);

        if (user) {
          const newUser = {
            id: user.uid,
            fname,
            lname,
            age,
            email,
          };

          // Save user data using UID as the document ID
          await setDoc(doc(collectionRef, user.uid), newUser);

          // Reset fields and switch to sign-in
          setFname("");
          setLname("");
          setAge(0);
          setEmail("");
          setPassword("");
          setIsSignupEnabled(false);

          //Take back to login
          window.location.href="/"
        }
      } catch (error) {
       alert(error.message);
      }
    }
  };

  //Handle signin
  const handleSignin = async (e, email, password) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill both fields!");
      return;
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
          console.log("User signed in with ID: ", user.uid);
          navigate('/profile')
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };
  return (
    <>
      {isSignupEnabled ? <h2>Sign Up</h2> : <h2>Sign In </h2>}
      <form>
        {isSignupEnabled && (
          <>
            <label>First Name</label>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            ></input>
            <br></br>

            <label>Last Name</label>
            <input
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            ></input>
            <br></br>

            <label>Age</label>
            <input
              type="number"
              min={10}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            ></input>
            <br></br>
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <br></br>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>

        <br></br>
        {isSignupEnabled ? (
          <button
            onClick={(e) => handleSignup(e, fname, lname, age, email, password)}
          >
            Sign Up
          </button>
        ) : (
          <button onClick={(e) => handleSignin(e, email, password)}>
            Sign In
          </button>
        )}
      </form>

      {isSignupEnabled && (
        <p>
          Have an account already? <span onClick={handleSwitch}>Sign In</span>
        </p>
      )}
      {!isSignupEnabled && (
        <p>
          Don't have an account already?{" "}
          <span onClick={handleSwitch}>Sign up</span>
        </p>
      )}
    </>
  );
}
