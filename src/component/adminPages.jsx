import { React, useState} from 'react'
import '../assets/css/adminPage.css'
import {Button} from 'react-bootstrap'
import TambahProduct from '../modal/tambahProduct'
import UpdateProduct from '../modal/updateProduct'
import Swal from 'sweetalert2'

const data = [
    {
        namaProduct: "helm",
        linkProduct: "linkntya"
    },
    {
        namaProduct: "jaket",
        linkProduct: "linkntya"
    },
    {
        namaProduct: "sepatu",
        linkProduct: "linkntya"
    },
]


function AdminPage(){
    const [tambahProduct, setTambahProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)

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
            <div className='akunLogin'>Login : handikaalfalaq@gmail.com</div>
            <Button className='delete' onClick={logOut}>Log Out</Button>
            <Button className='tambahProduct' onClick={() => setTambahProduct(true)}>Tambah Product</Button>

            <div className='dataProduct'>
                <div className='no'>no</div>
                <div className='nama'>Nama</div>
                <div className='link'>Link</div>
                <div className='action'>Action</div>
            </div>

            {data.map((item, index) => (
                <div className='dataProduct' key={index}>
                    <div className='no'>{index+1}</div>
                    <div className='nama'>{item.namaProduct}</div>
                    <div className='link'>{item.linkProduct}</div>
                    <div className='action'>
                        <Button className='update' onClick={() => setUpdateProduct(true)}>update</Button>
                        <Button className='delete'>delete</Button> 
                    </div>
                </div> 
            ))}
            <TambahProduct show={tambahProduct} onHide={() => setTambahProduct(false)}/>
            <UpdateProduct show={updateProduct} onHide={() => setUpdateProduct(false)}/>
        </div>
    )
}

export default AdminPage;