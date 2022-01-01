import * as React from 'react';
import { useEffect, useState } from 'react';
import { Api } from 'dynamic-gists-client';
// import { ClientVsCode } from './../../types';

export interface IListGists {
    getAuthToken:Function,
    vscode:any,
    apiUri:string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ListGists: React.FunctionComponent<IListGists> = (props: React.PropsWithChildren<IListGists>) => {
  const [gists, setGists] = useState<any>();
  const [gistKeyWord, setGistKeyWord] = useState<string>('');
  const [lastGistKeyWord, setLasGistKeyWord] = useState<string>(''); // TODO: check if new query is same than last one

  function loadGists(){
    let keyWord = gistKeyWord;
    if(!!keyWord){
      keyWord = undefined;
    }
    const responseGistsListing = await Api.Snippet.list(props.getAuthToken(), keyWord);
    setGists(responseGistsListing.data.results);
    console.log('GISTS!!!!!!!', responseGistsListing);
  }

  useEffect(async () => {
    loadGists();
  }, []);

  return (
    <div>
        listing
    </div>
  );
};