import React from "react";
import { Web3Button } from "@web3modal/react";
import { NavLink } from "react-router-dom";
import './header.css';

function Header () {
    return (
        <header>
            <div className="links">
               <NavLink exact to={"/"} className="home-navlink"> Home </NavLink>
               <NavLink to={"/proposals"} className="proposals-navlink"> Proposals </NavLink>
            </div>
            <div className="connect-btn-div">
                <Web3Button />
            </div>
        </header>
    )
}

export default Header;