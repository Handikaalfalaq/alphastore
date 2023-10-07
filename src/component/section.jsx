import "../assets/css/section.css"
import FolderImage from '../assets/img/folderImage' 

const data =[
    {
        namaProduct: 'topi',
        linkProduct: "https://www.instagram.com/",
    },
    {
        namaProduct: 'tas',
        linkProduct: "https://www.instagram.com/",
    },
    {
        namaProduct: 'sepatu',
        linkProduct: "https://www.instagram.com/",
    }
]
function Section(){
    return(
        <div>
            <div className="containerSection">
                <img className="imageLogo" src={FolderImage.logoAlphaStore} alt="logo Alpha Store" /> 
                <div>selamat datang di Alpha Store</div>
                <div>selamat berbelanja</div>
            </div>
            <div className="containerItem">
                {data.map((product, index) => (
                    <a href={product.linkProduct}className="cssItem" key={index}>{index + 1}. {product.namaProduct}</a>
                ))} 
            </div>

        </div>
    )
}

export default Section