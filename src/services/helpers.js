import moment from "moment";


export function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
     var ascii = binaryString.charCodeAt(i);
     bytes[i] = ascii;
  }
  return bytes;
}

export function saveByteArray(reportName, byte, applicationType="application/pdf") {
  var blob = new Blob([byte], {type: applicationType});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

export function downloadFile(text, fileType, fileName, a) {
  var blob = new Blob([text], { type: fileType });

  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  //   a.dataset.downloadurl = [fileType, a.download].join(":");
  // a.style.display = "none";
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  //   setTimeout(function () {
  //     URL.revokeObjectURL(a.href);
  //   }, 1500);

  const link = document.createElement('a');
  link.dataset.downloadurl = [fileType, link.download].join(":");
  // link.href = `${new Date().toUTCString()}.pdf`;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function () {
    URL.revokeObjectURL(link.href);
  }, 1500);
}


export function log(period="initial", message, ...optionalParams) {
  if (period == "initial") {
    console.log(message, optionalParams);
  }
}

/**
 * 
 * @param {*} arr 
 * @param {*} target 
 */
export let arrayChecker = (arr, target) => target.every(v => arr.includes(v));

/**
 * 
 * @param {*} arr 
 * @param {*} target 
 */
export let arraySome = (arr, target) => target.some(r=> arr.indexOf(r) >= 0);

export const appConstants = {
  admin: ["ISODSuperAdmin", "Admin"],
  maker: [ "ISODMaker", "Maker",],
  checker: ["ISODChecker", "Checker"],
  audit: ["Audit"],
  agent: ["Agent"],
  user: ["User"],
  recon: ["Recon"],
  reconTeamLead: ["ReconTeamLead"],
  teamLead: ["TeamLead"],
  user: ["User"],
  ussdTeams: ['Failed Airtime Recharge_Mobile Banking (First Monie)', 'FailedAirtimeTopUp_QS894DT', 'FailedAirtimeTopUp_QS894', 'Airtime & Bill Payment BAP', 'FailedAirtimeTopUp_QS904'],
}

export const myFilter = (source, key, match="id", type="match", searchArea=undefined) => {
  let result = [];
  
  if (Array.isArray(source)) {
    if (type === "match") {
      result = (source.filter(x => x[match].toString().toUpperCase() == key.toString().toUpperCase()));
    }
    else if (type === "includes") {
        source.filter(x => {
          if (!searchArea) {
            searchArea = Object.keys(x);
          }
          searchArea.map(sourceKey => {
            if (x[sourceKey] && x[sourceKey].toString().toUpperCase().includes(key.toUpperCase())) {
              result.push(x);
            }
          });
      });
    }
  }

  
  return result;
}

export function getParam(name){
  if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(window.location.search))
      return decodeURIComponent(name[1]);
}

export function splitWordByCasingAndSpace(word) {
  return word.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1).join(" ");
}

export function dataTableItem(data, skipId=true,formatDate=true) {
  // data.map()
  let result = [];
  try {
    
    data = data[0];
    
    let _keys = Object.keys(data);
    _keys.forEach(element => {
      result.push({
        title: splitWordByCasingAndSpace(element),
        render: (data, type, row, meta) => {
          let value = data[element];
          
          if (element.includes("date") && formatDate) {
            value = moment(value).format("yyyy-MM-DD hh:mm");
          }
          
          if (element.toLower() == "id") return;
          
          if (type === "display") {
            return `<span style="width: 90%; display:block; line-break:anywhere">${value}</span>`;
          }
          return `<span style="width: 90%; display:block;line-break:anywhere">${value}</span>`;
        },
        responsivePriority: 5,
      });
    });
    
    
  }
  catch(e) {}
  return result;
}