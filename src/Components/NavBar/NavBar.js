import {Link} from "react-router-dom";

const NavBar = () => {

    return (
            <nav className="dt w-100 border-box pa3 ph5-ns">
                <div className="dtc v-mid w-75 tr">
                    <Link to="/signin" >
                        <div className="link dim dark-gray f6 f5-ns dib mr3 mr4-ns pointer" >Sign In</div>
                    </Link>
                    <Link to="/register" >
                        <div className="link dim dark-gray f6 f5-ns dib pointer" >Register</div>
                    </Link>
                </div>
            </nav>
    )
}

export default NavBar;