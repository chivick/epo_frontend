import Axios from "axios";

//  const baseURL = "http://192.168.253.118:3130";
// const baseURL = "https://janapr.lonzecserver.com.ng";
// const baseURL = "https://fbn.lonzecserver.com.ng";
 //const baseURL = "https://localhost:44376";
const baseURL = "http://fbndisputeapp-dev.us-east-1.elasticbeanstalk.com";
//const baseURL = "https://192.168.253.118:4444";
//const baseURL = "http://192.168.253.118:4030";
// const baseURL = "https://192.168.66.121:8000";
//const baseURL = "https://disputeresolutionportal.firstbanknigeria.com:8000";
//const baseURL = "https://disputeresolutionportal.firstbanknigeria.com";


// const mayJunebaseURL = "https://mayjune.lonzecserver.com.ng";
// const mayJunebaseURL = "https://localhost:44389";
const mayJunebaseURL = "http://fbndisputeapp-dev.us-east-1.elasticbeanstalk.com";
//const mayJunebaseURL = "https://192.168.253.118:4444";
 //const mayJunebaseURL = "http://192.168.253.118:4030";
//  const mayJunebaseURL = "https://fbn.lonzecserver.com.ng";
//const mayJunebaseURL = "https://192.168.66.121:8000";
//const mayJunebaseURL = "https://disputeresolutionportal.firstbanknigeria.com:8000";
//const mayJunebaseURL = "https://disputeresolutionportal.firstbanknigeria.com";





const axios = Axios.create({
  baseURL: baseURL,
  mayJunebaseURL: mayJunebaseURL
  
});

const sprint2Axios = Axios.create({
  baseURL: mayJunebaseURL,  
});

export default axios;
export {baseURL, mayJunebaseURL, sprint2Axios};
