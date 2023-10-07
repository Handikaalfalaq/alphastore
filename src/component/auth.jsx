import { React, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../assets/css/authPage.css'
import { useMutation } from 'react-query';
import { registerUserApi, loginUserApi, getDataUserFromAPI} from '../config/firebase';
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function Auth({registerAPI, loginAPI, getNotes, dataRedux}) {
  const navigate = useNavigate()  
  const dispatch = useDispatch(); 
  const [waktu, setWaktu] = useState(3);
  const [dataForm, setDataForm] = useState({ 
      email:'',
      password:'', 
    }) 
     
      const handleChange = (e) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        })
      } 
    
    const handleSubmitRegister = useMutation(async (e) => {
      try {
        e.preventDefault(); 
        const isSuccess = await registerAPI({ email: dataForm.email, password: dataForm.password}); 
        if (isSuccess) { 
          setDataForm({
            email:'',
            password:'',
          });
        }  
      } catch (error) {
        console.log('error', error);
      }
    });

    const handleSubmitLogin = useMutation(async (e) => {
        try {
          e.preventDefault(); 
          const isSuccess = await loginAPI({ email: dataForm.email, password: dataForm.password });
          if (isSuccess) { 
            localStorage.setItem('userData', JSON.stringify(isSuccess))
            setDataForm({ 
              email:'',
              password:'', 
            });
            window.location.reload()
          } 
        } catch (error) {
          console.log('error', error);
        }
      }); 

      useEffect(() => { 
        if(localStorage.getItem('userData')  !== null) { 
          dispatch({ type: 'CHANGE_ISLOGIN', value: true }); 
          const userDataStorage = JSON.parse(localStorage.getItem('userData')) 
          getNotes(userDataStorage.uid) 
        } 
      }, [dispatch, getNotes]);
 
      useEffect(() => { 
        if (dataRedux.notes.role === "admin") {
          navigate("/admin");
        }
      }, [dataRedux.notes.role, navigate]); 

    useEffect(() => {
      const timer = setInterval(() => {
        setWaktu(prevWaktu => prevWaktu - 1);
      }, 1000); 
      if (waktu <= 0) {
        clearInterval(timer);
      } 
      return () => {
        clearInterval(timer);
      };
    }, [waktu]); 

    return (
      <> 
        {waktu > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
        
        ) : (
          <Form className='containerFormAuth'>
          {dataRedux.notes.role === "user" ? (
            <div>Anda bukan admin</div>
          ) : (
            <></>
          )} 
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleChange}/> 
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" onChange={handleChange} />
          </Form.Group> 

          <div className='containerButtonAuth'>
              <Button variant="primary" type="submit" className='buttonAuth' onClick={(e) => handleSubmitLogin.mutate(e)}> Login </Button>
              <Button variant="primary" type="submit" className='buttonAuth' onClick={(e) => handleSubmitRegister.mutate(e)}> Register </Button>
          </div>
        </Form>
        )}
        
      </>
    );
}

const reduxState = (state) => ({ 
  dataRedux :{
    isLogin: state.isLogin,
    notes: state.notes, 
  }
});

  const reduxDispatch = (dispatch) => ({
    registerAPI: (dataRegister) => dispatch(registerUserApi(dataRegister)),
    loginAPI: (dataLogin) => dispatch(loginUserApi(dataLogin)),
    getNotes: (data) => dispatch(getDataUserFromAPI(data)),
  });
  
  // export default connect(null, reduxDispatch) (Auth); 
  export default connect(reduxState, reduxDispatch) (Auth); 