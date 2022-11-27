import React from "react";
import { AiFillTwitterCircle, AiFillGithub } from 'react-icons/ai';
import './footer.css';



function Footer () {
    return (
        <footer>
            
         <p> made by @zankoocode 
           
         </p>
             <a href="https://twitter.com/zankoocode" target="_blank"> <AiFillTwitterCircle className="twitter-logo"/> </a>
             <a href="https://github.com/zankoocode" target="_blank"><AiFillGithub className="github-logo"/>  </a>
        
        </footer>
    )
}

export default Footer;