import falcor from 'falcor';
import FalcorDataSource from 'falcor-http-datasource';
import { errorFunc } from './layouts/CoreLayout';

class PublishingAppDataSource extends FalcorDataSource {
  onBeforeRequest ( config ) {
    const token = localStorage.token;
    const username = localStorage.username;
    const role = localStorage.role;

    if (token && username && role) {
      config.headers['token'] = token;
      config.headers['username'] = username;
      config.headers['role'] = role;
    }
  }
}

const model = new falcor.Model({
  source: new PublishingAppDataSource('/model.json'),   
  errorSelector: function(path, error) {
    console.info('errorSelector', path, error);
    errorFunc(error.value, path);
    error.$expires = -1000 * 60 * 2;
    return error;
  } 
  // source: https://netflix.github.io/falcor/documentation/model.html#the-errorselector-value
});

export default model;