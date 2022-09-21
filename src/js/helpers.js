import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// The Goal of this file (or module) is to contain a couple of functions that we will re-use over and over in our project and here in this Module we'll have a center plave for all of them

// Refactoring code (getJSON() and sendJSON()) into one AJAX Call

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
// an example will be to create a function which will get .json() (does the feching and converts to json in 1 step ABSTRACTING all this functionality into 1 nice function that we can use all over our project)
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // 'racing' the 2 Promises for avoinding infinite loadings when there is no internet connection(or slow)
    // also instead of puting the number seconds inside the timeout function (also called: magic numbers in programming bcuz this number will appear from nowhere and it's not explainable(readable for others that will read the code))
    const data = await res.json(); // carefull with awaiting always the promise response

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this data will bcome the Resolved value of this Promise
  } catch (err) {
    console.log(err);
    throw err; // taking the err (error object) that we have and throw this error and the Promise return from getJSON will be reject and it can be handled in the model.js
  }
};
// when is going to be an error in this function then the Promise that the getJOSN() return it will still be fullfilled (basically succesfull despite the err) but we want to handle this error message in the model.js file and we do that by rethrowing the err
// we basically propagated the err down from 1 async f to the other by rethrowing the err in the getJSON catch{} block

// Sending data to the API
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      // an obj with some options
      method: 'POST',
      headers: {
        // some snippets of text (info about the request itself)
        'Content-Type': 'application/json', // with this we tell the API that the data we gonna send is going to be in the JSON format
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // still racing for avoinding infinite loops
    const data = await res.json(); // still awaiting for a res cuz the API will send the data back

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
*/
