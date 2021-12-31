// global webview
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Api } from 'dynamic-gists-client';
import { LoginForm } from './components/auth/login';
import { ClientVsCode } from './types';



declare const acquireVsCodeApi: <T = unknown>() => ClientVsCode<T>;

const vscode = acquireVsCodeApi();

export interface IViewProps {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ViewPanel: React.FunctionComponent<IViewProps> = (props: React.PropsWithChildren<IViewProps>) => {
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [authTokenLoaded, setAuthTokenLoaded] = useState<boolean>(false);
  const [apiUri, setApiUri] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    vscode.postMessage({command:'getRefreshToken'});
    vscode.postMessage({command:'getApiUri'});
  }, []);

  // Handle plugin messages
  window.addEventListener('message', async event => {
    const message = event.data;
    // Handle refresh token request to the workspace storage
    if(message.command === 'getRefreshTokenResponse'){
      localStorage.setItem('authToken', message.token);
      // TODO: Api call for refrishing token
      const authToken = message.token;
      setAuthToken(authToken);
      setAuthTokenLoaded(true);
    }
    if(message.command === 'getApiUriResponse'){
      setApiUri(message.apiUri);
    }
    
  });
  

  function getInitialView(){
    if(authTokenLoaded){
      if(authToken){
        return `you are logged in! ${authToken}`;
      } else {
        return <LoginForm setAuthToken={setAuthToken} vscode={vscode} apiUri={apiUri} setError={setError}/>;
      }
    } else {
      return 'loading...';
    }
  }

  return (
    <div>
      Hello There1!
      <br/> 
      { getInitialView() }
      {error ? <h3>{error}</h3> : ''}
    </div>
  );
};