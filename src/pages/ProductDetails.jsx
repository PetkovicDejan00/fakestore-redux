import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { activeProduct, addProductToCart, removeActiveProduct } from '../redux/actions/productActions'
import { successPopup } from '../components/Popup'
import { nanoid } from 'nanoid'
import LoadingCircle from '../components/LoadingCircle'

const ProductDetails = () => {
  const [infoShown, setInfoShown] = useState(false)
  const [productError, setProductError] = useState('')
  const [productQty, setProductQty] = useState(1)
  const product = useSelector(state => state.product)
  const cartShown = useSelector(state => state.cart.cartShown)
  const {productId} = useParams()
  const dispatch = useDispatch()
  const {category, price, title, description, rating, image} = product

  const fetchSingleProduct = async () => {
    const response = await axios
    .get(`https://fakestoreapi.com/products/${productId}`)
    .catch(err => setProductError(err.message))

    dispatch(activeProduct(response.data))
  }

  const addToCart = (e) => {
    e.preventDefault()
    dispatch(addProductToCart({
      ...product, 
      productQty, 
      id: nanoid(),
      productTotalPrice: product.price * productQty,
    }))
    successPopup('Product added to cart')
    setProductQty(1)
  }

  useEffect(() => {
    productId && fetchSingleProduct()
    return () => {
      dispatch(removeActiveProduct())
    }
  }, [productId])

  if (productError) {
    return <h2 className="error">{productError}</h2>
  }

  const ratingStyles = (rating) => {
    if (rating > 0 && rating < 1) {
      return {background: '#ff4545'}
    } else if (rating > 1 && rating < 2) {
      return {background: '#ffa534'}
    } else if (rating > 2 && rating < 3) {
      return {background: '#ffe234', color: '#000'}
    } else if (rating > 3 && rating < 4) {
      return {background: '#b7dd29'}
    } else if (rating > 4 && rating < 5) {
      return {background: '#57e32c'}
    }
  }

  return (
    <>
    {cartShown === false &&
      <div className="container details-container">
      {Object.keys(product).length === 0 
      ? 
        <LoadingCircle />
      : 
        <div className="single-product">
          <div className="sp-img" 
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine">
                <img src={image} alt={title} />
          </div>
          <div className="sp-info" 
              data-aos="fade-left"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine">
                <h2 className="sp-title">{title}</h2>
                <div className="price_rating">
                  <p className="sp-price">${price} 
                    <span className="dot1"></span>
                    <span className="dot2"></span>
                  </p>
                  <p className="rating" style={ratingStyles(rating.rate)}>
                    ★ {rating.rate} out of {rating.count} rates.
                  </p>
                </div>
                <p className="sp-category">{category.toUpperCase()}</p>
                <p className="sp-desc">{description}</p>
                <form className="add-to-cart-form">
                  <div className="qty-input">
                    <label>Quantity:</label>
                    <input
                      name="qty-input"
                      type="number" 
                      min={1}
                      max={30}
                      onKeyDown={(e) => e.preventDefault()}
                      value={productQty}
                      onChange={(e) => setProductQty(Number(e.target.value))}
                    />
                  </div>
                  <button onClick={addToCart} className="sp-btn">Add to cart</button>
                </form>
                <p onClick={() => setInfoShown(prevInfo => !prevInfo)} className="show-info-btn">{`${infoShown ? 'Hide': 'Show'}`} info</p>
                {infoShown && 
                  <div className="info-msgs" data-aos="fade-up" data-aos-easing="ease-out-cubic">
                    <p className="info-msg">* <strong>Minimum</strong> number of products you can add to cart at once is <strong>1</strong>, while <strong>maximum</strong> is <strong>30</strong>.</p>
                    <p className="info-msg">* Use <strong>up/down arrows</strong> to select wanted number of products.</p>
                  </div>
                }
          </div>
        </div>
        }
      </div>
    }
    </>
  )
}

export default ProductDetails