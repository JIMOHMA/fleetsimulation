import { Link } from "react-router-dom"

function Footer() {
  return (
    <div>
      <footer>
        <section className="main-info">
          <div>
            <h2>WHY ELEMENT?</h2>
            <hr/>
            <ul>
              <li><Link to={"/home"}>Fleet services</Link></li>
              <li><Link to={"/home"}>Fleet solutions</Link></li>
              <li><Link to={"/home"}>Arc By Element, Electric Vehicle services offering</Link></li>
              <li><Link to={"/home"}>Leadership</Link></li>
              <li><Link to={"/home"}>Strategic Advisory</Link></li>
              <li><Link to={"/home"}>Supplier Diversity</Link></li>
            </ul>
          </div>
          <div>
            <h2>ABOUT</h2>
            <hr/>
            <ul>
              <li><Link to={"/home"}>Company</Link></li>
              <li><Link to={"/home"}>Invertor relations</Link></li>
              <li><Link to={"/home"}>News and events</Link></li>
              <li><Link to={"/home"}>Sustainability</Link></li>
              <li><Link to={"/home"}>Diversity, Equity, Inclusion and Belonging</Link></li>
              <li><Link to={"/home"}>Corporate Social Responsibility</Link></li>
              <li><Link to={"/home"}>Careers</Link></li>
              <li><Link to={"/home"}>Locations</Link></li>
            </ul>
          </div>
          <div>
            <h2>RESOURCES</h2>
            <hr/>
            <ul>
              <li><Link to={"/home"}>Resources home</Link></li>
              <li><Link to={"/home"}>Operations alert and response center</Link></li>
              <li><Link to={"/home"}>Blog</Link></li>
              <li><Link to={"/home"}>Motor company information</Link></li>
              <li><Link to={"/home"}>Vehicle licensing and registration updates</Link></li>
              <Link to={"/home"}></Link>
            </ul>
          </div>
        </section>
        <section className="socials">
          <h2 className="social-h2">
            Element Fleet Management
          </h2>
          <p className="first-child">Have a question? Whether you are a fleet manager, driver or supplier, we are here to help.</p>
        
          <Link id="contact-us" to={'/home'}>Contact us</Link>
          <p className="last-child">Follow us</p>
          <div className="social-icons">
            <li className="linkedIn"><i className="fa-brands fa-linkedin"></i></li>
            <li><i className="fa-brands fa-facebook-f"></i></li>
            <li><i className="fa-brands fa-instagram"></i></li>
            <li><i className="fa-brands fa-youtube"></i></li>
            <li><i className="fa-brands fa-square-x-twitter"></i></li>
          </div>
        </section>
      </footer>
    </div>
  )
}

export default Footer
