import React, { useState } from 'react'
import BtnRender from './BtnRender'

function ProductItem({ product, isAdmin, deleteProduct, handleCheck, total }) {
    console.log(total, 'produk123123')
    const [nilaiMinimumSupport] = useState("4")
    const [nilaiMinimumConfidence] = useState("14")
    return (
        <div className="product_card">


            {total?.totalSuport >= `${nilaiMinimumSupport}` &&
                <div style={{ position: "absolute" }}>
                    <img src='/bestseller.png' style={{ width: "35%", height: "35%", padding: "5px" }} />
                </div>
            }

            {/* {
                product.sold >= 13 &&
                <div style={{ position: "absolute" }}>
                    <img src='/bestseller.png' style={{ width: "35%", height: "35%", padding: "5px" }} />
                </div>
            } */}

            {
                isAdmin && <input type="checkbox" checked={product.checked}
                    onChange={() => handleCheck(product._id)} />
            }

            <img src={product.images.url} alt="" />

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <span style={{ color: "blue" }}>${product.price}</span>
                <p>{product.description}</p>
                <p style={{ marginTop: "-30px", color: "red" }}><b>Terjual  {product.sold}</b></p>
                <BtnRender product={product} deleteProduct={deleteProduct} />
            </div>
        </div>
    )
}

export default ProductItem
