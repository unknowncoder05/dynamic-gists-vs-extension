// global webview
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Api } from 'dynamic-gists-client';
import { LoginForm } from './components/auth/login';
import { ClientVsCode } from './types';
import { ListGists } from './components/gists/list';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';


declare const acquireVsCodeApi: <T = unknown>() => ClientVsCode<T>;

const vscode = acquireVsCodeApi();

export interface IViewProps {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ViewPanel: React.FunctionComponent<IViewProps> = (props: React.PropsWithChildren<IViewProps>) => {
  const [extensionLoaded, setExtensionLoaded] = useState<boolean>(false);
  const [authed, setAuthed] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [apiUri, setApiUri] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    vscode.postMessage({command:'getRefreshToken'});
    vscode.postMessage({command:'getApiUri'});
  }, []);

  function setLocalAuthToken(authToken:string){
    localStorage.setItem('authToken', authToken);
    setAuthed(true);
  }

  function setTokens(authToken:string, refreshToken:string){
    setLocalRefreshToken(authToken);
    setLocalAuthToken(refreshToken);
    vscode.postMessage({command:'setRefreshToken', token:refreshToken});
  }

  function setLocalRefreshToken(refreshToken:string){
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Handle plugin messages
  window.addEventListener('message', async event => {
    const message = event.data;
    // Handle refresh token request to the workspace storage
    if(message.command === 'getRefreshTokenResponse'){
      setLocalRefreshToken(message.token);
      // TODO: Api call for refreshing token
      const refreshToken = message.token;
      if(refreshToken){
        const refreshResponse = await Api.Authentication.refresh(refreshToken, apiUri);
        setLocalAuthToken(refreshResponse.data.access);
      }
      setExtensionLoaded(true);
    }
    if(message.command === 'getApiUriResponse'){
      setApiUri(message.apiUri);
    }
    
  });
  
  function getPathView(){
    if(extensionLoaded){
      if(!authed){
        return <LoginForm setTokens={setTokens} vscode={vscode} apiUri={apiUri} setError={setError}/>;
      }
    } else {
      return 'loading...';
    }

    switch (currentPath) {
      case '/home':
        return 'gists!';
      case '/gists/list':
        return <ListGists vscode={vscode} apiUri={apiUri}/>;
    
      default:
        break;
    }
  }

  return (
    <div>
      {currentPath}<br/>
      Hello There!
      <br/> 
      {error ? <h3>{error}</h3> : ''}
      <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home" onClick={()=>setCurrentPath('/home')}>Gists</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/gists/list" onClick={()=>setCurrentPath('/gists/list')}>search</Nav.Link>
        </Nav>
        </Container>
      </Navbar>
      {getPathView()}
    </div>
  );
};