import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';

function Header() {
  return (
    <>
      <header>
        <h3>
          <Link className="text-on-light" to={'/home'}>Fleet Manager</Link>
        </h3>
        <nav>
            <Link to={"/home"}>Home</Link>
            <Link to={"/acquisitions"}>Acquisitions</Link>
            <HashLink to="/#aboutelement">About</HashLink>
        </nav>
      </header>
    </>
  )
}

export default Header