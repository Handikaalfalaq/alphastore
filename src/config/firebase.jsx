import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc} from "firebase/firestore";
import Swal from 'sweetalert2'  

const firebaseConfig = {
    apiKey: "AIzaSyBWdrE9n0nWlfy2kEnD9-rwb4u_9FYPDQ4",
    authDomain: "fir-expo-d9316.firebaseapp.com",
    projectId: "fir-expo-d9316",
    storageBucket: "fir-expo-d9316.appspot.com",
    messagingSenderId: "467087330399",
    appId: "1:467087330399:web:e6dbb11db0c62259db9fea"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp); 

export { auth, database};

export const registerUserApi = (dataRegister) => (dispatch) => {
    dispatch({ type: 'CHANGE_LOADING', value: true }); 
    console.log("dataregister", dataRegister);
    // Registrasi pengguna dengan Firebase Authentication
    createUserWithEmailAndPassword(auth, dataRegister.email, dataRegister.password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid; // Dapatkan UID pengguna dari Firebase Authentication
            console.log("userid", userId )

            // Tambahkan data pengguna ke Firestore menggunakan UID sebagai ID dokumen
            try {
                const userDocRef = doc(database, "users", userId);
                setDoc(userDocRef, {
                  role: "user",
                  userId: userId, 
                  email: dataRegister.email,
                });
            
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Register successful',
                  showConfirmButton: false,
                  timer: 1500,
                });
            
                dispatch({ type: 'CHANGE_LOADING', value: false });
                return true;
              } catch (error) {
                console.error('Error updating document: ', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Register gagal',
                });
            
                dispatch({ type: 'CHANGE_LOADING', value: false });
                return false;
              }
        })
        .catch((error) => {
            // Handle error jika gagal melakukan registrasi dengan Firebase Authentication
            const errorCode = error.code;
            let errorMessage = 'Registrasi Gagal.';

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = 'Email sudah terdaftar.';
            } else if (errorCode === 'auth/weak-password') {
                errorMessage = 'Kata sandi harus terdiri dari minimal 6 karakter.';
            } else if (errorCode === 'auth/invalid-email') {
                errorMessage = 'Masukkan alamat email dengan benar.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });

            dispatch({ type: 'CHANGE_LOADING', value: false }); 
        });
};

  
export const loginUserApi = (dataLogin) => (dispatch) => {
  dispatch({type: 'CHANGE_LOADING', value: true})
   const loadingSwal = Swal.fire({
    title: 'Processing...',
    html: 'Please wait, processing your request.',
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
        Swal.showLoading();
    }
  });

  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, dataLogin.email, dataLogin.password)
      .then((dataLogin) => { 
          const dataUserLogin = {
            email: dataLogin.user.email,
            uid: dataLogin.user.uid,
            emailVerified: dataLogin.user.emailVerified,
            refreshToken: dataLogin.user.refreshToken
          }
          loadingSwal.close();
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'login successful',
              showConfirmButton: false,
              timer: 1500
          })
          dispatch({type: 'CHANGE_LOADING', value: false})
          dispatch({type: 'CHANGE_ISLOGIN', value: true}) 
          dispatch({type: 'CHANGE_USER', value: dataUserLogin})
          resolve(dataUserLogin);
      })
      .catch((error) => {
        loadingSwal.close();
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login Gagal',
        });        
        dispatch({ type: 'CHANGE_LOADING', value: false });
        reject(false);
      })
  })
};

export const getDataUserFromAPI = (userId) => async (dispatch) => { 
    const userRef = doc(database, "users", userId);
    try {
      const userDoc = await getDoc(userRef);   
      if (userDoc.exists()) {
        const userData = userDoc.data(); 
        dispatch({ type: 'SET_NOTES', value: userData });
        console.log("userData", userData)
        return userData;  
      }
    } catch (error) { 
      return {};
    }
  };