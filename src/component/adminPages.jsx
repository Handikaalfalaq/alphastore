import { React, useState, useEffect} from 'react'
import '../assets/css/adminPage.css'
import {Button} from 'react-bootstrap'
import TambahProduct from '../modal/tambahProduct'
import UpdateProduct from '../modal/updateProduct'
import Swal from 'sweetalert2'
import { connect } from 'react-redux' 
import { getDataProductFromAPI, deleteProductFromApi } from '../config/firebase'

function AdminPage({dataRedux, getProduct, deleteProductAPI}){
    const [tambahProduct, setTambahProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)
    const [dataProduct, setDataProduct] = useState([])
    const [idProduct, setIdProduct] =  useState()
    const [isLoading, setIsLoading] = useState(true);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        getProduct();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    useEffect(() => {
        const fetchData = async () => {
        try { 
            if(dataRedux.product.length !== undefined) {
                setDataProduct(dataRedux.product); 
                setIsLoading(false);
            } 
        } catch (error) {
            console.log(error);
        }
        };

        fetchData();
    }, [dataRedux.product]);

    const updateProductId = (id) =>  {
        setUpdateProduct(true);
        setIdProduct(id) 
    }

    const deleteProductId = (id) => {
        deleteProductAPI(id)
      };

    const logOut = () => { 
        Swal.fire({
          title: 'apakah kayu yakin akan logout?', 
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout!'
        }).then((result) => {
          if (result.isConfirmed) { 
          localStorage.removeItem('userData'); 
            Swal.fire(
              'Logout success'
            )
          window.location.reload();
          }
        })
      }
    
    return(
        <div className="containerAdminPage">
            <div className='akunLogin'>Login : {dataRedux.notes.email}</div>
            <Button className='delete' onClick={logOut}>Log Out</Button>
            <Button className='tambahProduct' onClick={() => setTambahProduct(true)}>Tambah Product</Button>

            <div className='dataProduct'>
                <div className='no'>no</div>
                <div className='nama'>Nama</div>
                <div className='link'>Link</div>
                <div className='action'>Action</div>
            </div>

            {isLoading ? (
                <div>loading...</div>
            ) : (
            
            dataProduct.length === 0 ? (
                <div>Product Kosong</div>
            ) : (
                dataProduct.map((product, index) => (
                    <div className='dataProduct' key={index}>
                        <div className='no'>{index+1}</div>
                        <div className='nama'>{product.namaProduct}</div>
                        <a href={product.linkProduct} className='link' target="_blank" rel="noopener noreferrer"> {product.linkProduct} </a>
                        <div className='action'>
                            <Button className='update' onClick={() => updateProductId(product.id)}>update</Button>
                            <Button className='delete' onClick={() => deleteProductId(product.id)}>delete</Button> 
                        </div>
                    </div> 
                ))
            )
            )}
            <TambahProduct show={tambahProduct} onHide={() => setTambahProduct(false)} />
            <UpdateProduct show={updateProduct} onHide={() => setUpdateProduct(false)} idProduct={idProduct}/>
        </div>
    )
}

const reduxState = (state) => ({
    dataRedux: {
        product: state.product,
        notes: state.notes
    }
})

const reduxDispatch = (dispatch) => ({
    getProduct: () => dispatch(getDataProductFromAPI()),
    deleteProductAPI: (id) => dispatch(deleteProductFromApi(id)),
})

export default connect(reduxState, reduxDispatch) (AdminPage);