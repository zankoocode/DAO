import React from "react";
import './proposals.css';

function ProposalsTab () {
    return (
        <div className="propaslsTab">

            <div className="search-for-proposal">
               
                <input placeholder="proposal id" id="proposal-search" />
                <button className="search-btn">
                    Search
                </button>
            </div>

            <div className="proposal-div">
                <div className="proposal-info">
                <p className="proposal-id">
                    Proposal {/* ID of Proposal*/}
                    
                </p>
                <ul>
                    <li>
                        NFT Id: 
                    </li>
                    <li>
                        Deadline: 
                    </li>
                   <li>
                    For: 
                   </li>
                   <li>
                    Against:
                   </li>
                </ul>
                </div>
                <div className="buttons">
                <button className="vote-btn">
                    Vote
                </button>
                <button className="execute-btn">
                    Execute
                </button>
                </div>
            </div>

            

        </div>
    )
}

export default ProposalsTab;