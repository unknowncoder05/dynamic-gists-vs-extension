import * as React from 'react';
// import { ClientVsCode } from './../../types';

export interface IGist {
    data:any, // bring snippet type
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Gist: React.FunctionComponent<IGist> = (props: React.PropsWithChildren<IGist>) => {

  return (
    <div>
        name: {data.name}<br/>
        description: {data.description}<br/>
        version: {data.version}<br/>
        latest: {data.latest}<br/>
    </div>
  );
};