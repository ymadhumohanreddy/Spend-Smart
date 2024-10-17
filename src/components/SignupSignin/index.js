import React, { useState } from 'react';
import './styles.css';
import Input from '../input';
import Button from '../Button'; // Assuming you have a Button component
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth,db, provider} from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 

import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

function SignupSigninComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginForm,setLoginForm]=useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function signupWithEmail(e) {
    e.preventDefault(); // Prevent form submission
    setLoading(true);

    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all the fields!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password don't match");
      setLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success("User Created!");
        setLoading(false);
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        createDoc(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
  }
  function loginUsingEmail(){
    console.log("Email",email);
    console.log("Password",password);
    setLoading(true);
if ( email!="" || password!="" ){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged In!")
    console.log("User Logged in",user);
    setLoading(false);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setLoading(false);
    toast.error(errorMessage);
  });
}else{
  toast.error("Please fill all the fields");
  setLoading(false);
}
    
  }
 async function createDoc(user){
setLoading(true);
 if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {

  try{
await setDoc(doc(db, "users", user.uid), {
    name: user.displayName ? user.displayName : name,
    email: user.email,
    password: password,  
    photoURL: user.photoURL ? user.photoURL : "",
    createdAt: new Date(),
});

        toast.success("Doc created");
        setLoading(false);
  }
   catch(e){
    toast.error(e.message);
    setLoading(false);
   }
  }else{
    //toast.error("Doc already exists");
    setLoading(false);
  }
  }
  function googleAuth(){
    setLoading(true);
    try{
     signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("user>>>",user);
    createDoc(user);
    navigate("/dashboard");
    setLoading(false);
    toast.success("User authenticated using Google!");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
   
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
     toast.error(errorMessage);
      setLoading(false);
    
  });
    }catch(e){toast.error(e.message)}
     setLoading(false);
    
  }
  return (
    <>
    {loginForm?<div className="signup-wrapper">
      <h2 className="title">
         Enter <span style={{ color: 'var(--theme)' }}>SpendSmart.</span>
      </h2>
      <form onSubmit={signupWithEmail}>
        
        <Input
          type="email"
          label="Email"
          state={email}
          setState={setEmail}
          placeholder="example@gmail.com"
        />
        <Input
          type="password"
          label="Password"
          state={password}
          setState={setPassword}
          placeholder="example#2e3"
        />
        
        <Button 
          disabled={loading}
          text={loading ? "Loading..." : "Login  using Email and Password"}
          onClick={loginUsingEmail}
        />
        <p className='p-login'>or</p>
        <Button 
        onClick={googleAuth}
        text={loading ? "Loading..." : "Login using Google" }blue={true} />
        <p className='p-login' style={{cursor:"pointer"}}onClick={()=>setLoginForm(!loginForm)}>or Don't Have An Account? Click Here</p>
      </form>
    </div>:<div className="signup-wrapper">
      <h2 className="title">
        Get Started with <span style={{ color: 'var(--theme)' }}>SpendSmart.</span>
      </h2>
      <form onSubmit={signupWithEmail}>
        <Input
          label="Full Name"
          state={name}
          setState={setName}
          placeholder="Your Name"
        />
        <Input
          type="email"
          label="Email"
          state={email}
          setState={setEmail}
          placeholder="example@gmail.com"
        />
        <Input
          type="password"
          label="Password"
          state={password}
          setState={setPassword}
          placeholder="example#2e3"
        />
        <Input
          type="password"
          label="Confirm Password"
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder="example#2e3"
        />
        <Button 
          disabled={loading}
          text={loading ? "Loading..." : "Signup using Email and Password"}
          onClick={signupWithEmail}
        />
        <p className='p-login'>or</p>
        <Button  onClick={googleAuth}
        text={loading ? "Loading..." : "Signup using Google" }blue={true} />
         <p className='p-login' style={{cursor:"pointer"}}onClick={()=>setLoginForm(!loginForm)}>or Have An Account Already? Click Here</p>
      </form>
    </div>}
    
    </>
    
  );
}

export default SignupSigninComponent;
