import * as React from 'react';
import { useState } from 'react';
import { Api } from 'dynamic-gists-client';
// import { ClientVsCode } from './../../types';

export interface ILoginFormProps {
    setAuthToken: Function,
    setError: Function,
    vscode:any,
    apiUri:string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LoginForm: React.FunctionComponent<ILoginFormProps> = (props: React.PropsWithChildren<ILoginFormProps>) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const authTokens = await Api.Authentication.auth(email, password, props.apiUri);
    //console.log('authTokens', authTokens);
    if(authTokens.status === 200){
      props.setAuthToken(authTokens.data.access);
    } else if(authTokens.status !== 500){
      props.setError({msg:authTokens.data.details});
    }
    
  };

  return (
    <div>
      Now login to access your Gists!
      <form onSubmit={handleSubmit}>
        <label>Enter your email:
        <input
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </label>
        <br/>
        <label>Enter your password:
          <input
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" />
        </label>
    </form>
    </div>
  );
};