import React from 'react'
import { Link } from 'react-router-dom'
import cart from '../assets/icons/cart.png'
import { useSelector, useDispatch } from 'react-redux'
import { removeCart, showCart } from '../redux/actions/productActions'
import { successPopup } from './Popup'
import logo from '../assets/icons/logo.png'

const Header = ({token, setToken}) => {
  const cartState = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const handleCartRemoval = () => {
    dispatch(removeCart())
    window.scrollTo(0,0);
  }

  const toggleCart = () => {
    if (cartState.cartShown === true) {
       handleCartRemoval()
    } else {
      dispatch(showCart())
    }
  }

  const handleLogout = () => {
    if (token) {
      {cartState.cartShown && dispatch(removeCart())}
      setToken("")
      localStorage.removeItem('authToken')
      successPopup('Logged out successfully.')
    }
  }

  return (
    <nav className="header">
      <div className='container'>
        <Link className="nav-logo" onClick={() => handleCartRemoval()} title="Home page" to=".">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="header-links">
          {token &&
            <div className='cart-frame' onClick={() => toggleCart()}>
              <img className="cart-icon-img" src={cart} alt="Cart" title="cart"/>
              <span className="cart-icon-items">{cartState.cartProducts.length}</span>
            </div>
          }
          <Link onClick={() => handleLogout()} to={'/login'}>
            {token ? 'Logout' : 'Login'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header