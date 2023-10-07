import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Swal from 'sweetalert2'
import { getStorage } from "firebase/storage";

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
const storage = getStorage(firebaseApp);

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
        return userData;  
      }
    } catch (error) { 
      console.log("salah", error);
    }
  };

export const createNewProductToApi = (data) => async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      });

      if (result.isConfirmed) {
        const loadingSwal = Swal.fire({
          title: 'Creating new product...',
          html: 'Please wait, creating your product.',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
        const timestamp = new Date().getTime();
        const folderName = 'imageProduct';
        const imageUrls = [];

        if(data.imageProduct !== undefined){
          for (let i = 0; i < data.imageProduct.length; i++) {
            const file = data.imageProduct[i];
            const imageName = `${data.namaProduct}_${timestamp}_${file.name}`;
            const storageRef = ref(storage, `${folderName}/${imageName}`);
            const metadata = {
              contentType: 'image/jpeg',
            };
            await uploadBytes(storageRef, file, metadata);
            const downloadURL = await getDownloadURL(storageRef);
            imageUrls.push(downloadURL);
          }
        } 

        const dataProductCollectionRef = collection(database, 'dataProduct');
        await addDoc(dataProductCollectionRef, {
          namaProduct: data.namaProduct,
          linkProduct: data.linkProduct,
          urlImageProduct: imageUrls,
        });

        loadingSwal.close();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Create New Product Successful',
          showConfirmButton: false,
          timer: 1500,
        }); 
        resolve(true);
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        resolve(false);
      } else { 
        reject('Unexpected result');
      }
    } catch (error) {
      console.error('Error creating product: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Create New Product failed!',
      });
      reject(false);
    }
  });
};

export const getDataProductFromAPI = () => async (dispatch) => { 
  try { 
    const querySnapshot = await getDocs(collection(database, 'dataProduct'));
    const productData = [];
    querySnapshot.forEach((doc) => { 
      productData.push({ id: doc.id, ...doc.data() }); 
    }); 

    dispatch({ type: 'SET_PRODUCT', value: productData }); 
    return { productData };
  } catch (error) {
    console.error('Error fetching data: ', error); 
  }
};

export const updateProductToApi = (data) => async () => {  
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      });

      if (result.isConfirmed) {
        const loadingSwal = Swal.fire({
          title: 'Creating update product...',
          html: 'Please wait, creating your product.',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });
        const productRef = collection(database, 'dataProduct');
        const querySnapshot = await getDocs(productRef);
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        }); 
        const filteredProducts = products.filter(product => product.id === data.id);
        const filteredImageProducts = filteredProducts[0].urlImageProduct
        const timestamp = new Date().getTime();
        const folderName = 'imageProduct';
        const imageUrls = [];

        if(data.imageProduct !== undefined){
          for (let i = 0; i < data.imageProduct.length; i++) {
            const file = data.imageProduct[i];
            const imageName = `${data.namaProduct}_${timestamp}_${file.name}`;
            const storageRef = ref(storage, `${folderName}/${imageName}`);
            const metadata = {
              contentType: 'image/jpeg',
            };
            await uploadBytes(storageRef, file, metadata);
            const downloadURL = await getDownloadURL(storageRef);
            imageUrls.push(downloadURL);
          }
        } 

        const dataProductDocRef = doc(database, 'dataProduct', data.id);
        await setDoc(dataProductDocRef, { 
          namaProduct: data.namaProduct,
          linkProduct: data.linkProduct,
          urlImageProduct: [ ...filteredImageProducts, ...imageUrls],
        });
        loadingSwal.close();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update successful',
          showConfirmButton: false,
          timer: 1500,
        }); 
        resolve(true);
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        resolve(false);
      } else { 
        reject('Unexpected result');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Update gagal',
      }); 
      reject(false);
    }
  });
};

export const deleteProductFromApi = (data) => async (dispatch) => {

  try {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingSwal = Swal.fire({
            title: 'Deleting...',
            html: 'Please wait, deleting your item.',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });


        try {
          await deleteDoc(doc(database, 'dataProduct', data));
          loadingSwal.close();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Delete successful',
              showConfirmButton: false,
              timer: 1500,
              didClose: () => {
                window.location.reload();
            }
          });
          
          return true;  
        } catch (error) {
          console.error('Error updating document: ', error); 
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Update gagal',
          });
          loadingSwal.close();
          dispatch({ type: 'CHANGE_LOADING', value: false });
          return false;
      }


  };
});

  } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Delete gagal',
      });

      dispatch({ type: 'CHANGE_LOADING', value: false });
      return false;
  }
};
