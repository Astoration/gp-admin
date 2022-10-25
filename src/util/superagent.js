import superagent from 'superagent';
import cookie from 'react-cookies';

const API_SERVER = 'http://ec2-15-165-158-199.ap-northeast-2.compute.amazonaws.com:8003';

export const ENDPOINT = API_SERVER;

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';
export const PUT = 'PUT';
export const PATCH = 'PATCH';

export default function superagentClient() {
  return (type, endpoint, options = {}) => {
    return new Promise((resolve, reject) => {
      const request = superagent(type, ENDPOINT + endpoint);
      //request.withCredentials();
      let auth = cookie.load('Authorization');
      if(auth != null){
        request.set('Authorization',auth);
      }
      let hasFile = false;
      for (let key in options.body) {
        if (options.body[key] === null) continue;
        if((options.body[key] && options.body[key].file != null) || (Array.isArray(options.body[key]) && options.body[key].length>0
            && options.body[key][0].file != null)) hasFile = true;
      }
      hasFile = hasFile || (options.files != null);
      if (hasFile) {
        for (let key in options.body) {
          if (options.body[key] === null) continue;
          if((options.body[key] && options.body[key].file != null) || (Array.isArray(options.body[key]) && options.body[key].length>0
              && options.body[key][0].file != null)){
            if (Array.isArray(options.body[key])) {
              options.body[key].forEach((file) => {
                request.attach(key, file.file);
              });
            } else {
              request.attach(key, options.body[key].file);
            }
          }else{
            request.field(key, options.body[key]);
          }
        }
      } else {
        if (options.body) {
          request.type('form');
          request.send(options.body);
        }
      }
      let query = options.query;
      if (query != null) {
        for (let field of Object.keys(query)) {
          if (query[field] == null) delete query[field];
        }
      }
      request.query(query);
      request.end((err, res) => {
        if (err) {
          if (res) {
            const { status, text } = res;
            let body = text;
            try {
              body = JSON.parse(text);
            } catch (e) {
              // Do nothing
            }
            return resolve({
              status,
              body,
              error: err.toString(),
            });
          } else {
            // Network error!
            return resolve({
              status: -100,
              body: err.message,
              error: err.toString(),
            });
          }
        }
        const { status, body } = res;
        return resolve({
          status,
          body,
        });
      });
    });
  };
}