import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>PPGBasel</Link>
      </div>
      <ul>
        <li>
          <Link to='/login'>
            <FaSignInAlt /> Masuk
          </Link>
        </li>
        <li>
          <Link to='/register'>
            <FaUser /> Buat Akun
          </Link>
        </li>
      </ul>
    </header>
  )
}

export default Header