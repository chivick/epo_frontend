import { useState, useRef } from "react";
import App from "../../services";
import { GrayCircleAvatar, Button, SecondaryButton } from "../../custom";
import { appConstants } from '../../services/helpers';
import { urls } from "../../services/urls";
// import { acceptRefund, submitForm, declineRefund, callReconRefund } from "../../pages/ReconRevalidation"

function JournalDetails(props) {

    const [imgPopUp,setImgPopUp] = useState(false)
    const [base64,setBase64] = useState("")
    const [newComment, setNewComment] = useState(false)
    const imgPosition = useRef()
    

    const closeRevalidationDispute = (dispute) => {
        props.load(true);
        App.getRequest(urls.closeRevalidationDispute + dispute).then(result => {
            console.log(result)
        }).finally(() => props.load(false));
      }

    const scrollOnView = () => {
        if(base64) {
            if(imgPosition.current) {
                imgPosition.current.scrollIntoView({behavior: "smooth"})
            }
            
        }  
    }

    const imgToView = () => {
        if(base64) {
            setImgPopUp(true);
        }
    }

    const onSetBase64 = (img) => {
        if(img !== ".." || img !== "") {
            setBase64(img)
            imgToView()
            scrollOnView()
        }
    }


    const details = props.details

    const comments = props.comments || []

    const [commentText, setCommentText] = useState("")
    
    let withComments = false

    if(comments.length > 0) {
        withComments = true    
    } else { withComments = false }
   

    const handleSubmit = (e) => {
        e.preventDefault()
        if(commentText) {
            props.postComment(details.UniqueId,commentText)
            setCommentText("")
            
            props.getCommentsData(details.DisputeLogId)
            
            setNewComment(!newComment)

            //props.load(true)
            //setTimeout(function(){setNewComment(!newComment)},1000)
            //props.load(false)
        }
     }


  return (
    <div style={{maxHeight: "80vh",overflowY: "scroll",position:"relative"}}>
    <div className="table-responsive p-1">
        <table 
            className="table table-bordered table-light table-striped my-1 shadow-sm" 
            style={{ "width" : "100%" }}>
            <thead>
                <th colspan="4" 
                    className="fs-6" 
                    style={{"boxShadow": "0px 0px 10px 2px gray inset","textIndent": 50}}>Dispute Details</th>
            </thead>
            <tbody>    
                <tr>
                    <th>Dispute ID</th> <td>{details.DisputeLogId}</td>
                    <th>RRN</th> <td>{details.IssuerRRN || "N/A"}</td>
                </tr>
                <tr>
                    <th>Amount</th> <td>{details.TransAmount || "N/A"}</td>
                    <th>Status</th> <td>{details.Status || "N/A"}</td>
                </tr>
                <tr>
                    <th>Agent Name</th> <td>{details.AgentName || "N/A"}</td>
                    <th>Agent ID</th> <td>{details.CevaAgentId || "N/A"}</td>
                </tr>
                <tr>
                    <th>Agent Account No.</th> <td>{details.AgentAcctNo || "N/A"}</td>
                    <th>Card Type</th> <td>{details.CardType || "N/A"}</td>
                </tr>
                <tr>
                    <th>PAN</th> <td>{details.PAN  || "N/A"}</td>
                    <th>Transaction Date</th> <td>
                      {details.Transaction_Date
                        ? App.convertToTimeString(details.Transaction_Date)
                        : "N/A"}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="table-responsive p-1">
        <table 
            className="table table-bordered table-light table-striped my-1 shadow-sm" 
            style={{ "width" : "100%" }}>
            <thead>
                <th colspan="5" className="fs-6" style={{"boxShadow": "0px 0px 10px 2px gray inset","textIndent": 50}}>Comments History</th>
            </thead>
            <tbody>
                <tr>
                    <th>SN</th>
                    <th>Comment</th>
                    <th>Comment By</th>
                    <th>Date</th>
                    <th>View</th>
                </tr>
                {
                    withComments && comments.map((comment,index)=>{
                        return (<tr>
                            <td>{index + 1}</td>
                            <td>{comment.Comment}</td>
                            <td>{comment.UserId}</td>
                            <td>{comment.Created}</td>
                            {(comment.Journal !== "..") && (
                                <td><button className="btn btn-sm btn-success" onClick={()=>{onSetBase64(comment.Journal)}}><span for="view-img">View</span></button></td>)}
                            {(comment.Journal === "..") && (
                                <td><button className="btn btn-sm btn-secondary"><span for="view-img">View</span></button></td>)}
                            
                        </tr>)
                    })
                }
                
            </tbody>
        </table>
    </div>

    <div className="container mb-3">
        <div className="row">
            <div className="col-7">
                <textarea name="commentText" value={commentText} onChange={(e)=>setCommentText(e.target.value)} className="form-control" placeholder="Enter new comment..." />
            </div>
            <div className="col-5">
                <button className="btn btn-secondary" onClick={handleSubmit}>Post</button>
            </div>
        </div>


        <div className="row py-3">
            {/* {(App.getUserRole() !== "Agent" && !details.IsRevalidation) ? (
            <div className="col-md-6">
                <Button onClick={acceptRefund}>Accept</Button>
            </div>
            ) : null}
            {App.getUserRole() === "Agent" ? (
            <div className="col-md-12">
                <Button onClick={submitForm}>Submit</Button>
            </div>
            ) : null}
            {((App.getUserRole() === "User" ||
            App.getUserRole() === "TeamLead") && !details.IsRevalidation) ? (
            <div className="col-md-6">
                <SecondaryButton onClick={declineRefund}>
                Decline
                </SecondaryButton>
            </div>
            ) : null}
            {App.getUserRole() === "Recon" ||
            App.getUserRole() === "ReconTeamLead" ? (
            <div className="col-md-6">
                <SecondaryButton onClick={callReconRefund}>
                Fund Confirmation
                </SecondaryButton>
            </div>
            ) : null} */}
            {details.IsRevalidation && ([...appConstants.user].includes(App.getUserRole()) || [...appConstants.teamLead].includes(App.getUserRole())) ? (
            <div className="col-md-6">
                <Button onClick={() => closeRevalidationDispute(details.UniqueId)}>
                Close
                </Button>
            </div>
            ) : null}
        </div>
    </div>

    {(imgPopUp && base64 ? true: false) && (<div ref={imgPosition} id="img-container" style={{width: "80%", height: "auto",border: "4px solid darkgreen",borderRadius: 8, margin:"6px auto"}}>
                    <div>View Attachment <span class="text-center" style={{float: "right", backgroundColor: "black", color: "white", fontSize: "25px", padding: "15px", cursor: "pointer"}} onClick={()=>{setImgPopUp(false);setBase64("")}}>Close Image</span></div>
                    <img
                        style={{width:"100%",height:"auto"}}
                        src={`data:image/png;base64, ${base64}`}
                        // alt="Attachment"
                        className="mx-auto d-block"
                    />
                </div>)
    }

    </div>
  )
}

export default JournalDetails