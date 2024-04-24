import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSocket, Socket, Extension } from './libs';

import Button from '/components/atoms/button';
import Card from '/components/atoms/card';
import Input from '/components/inputs/text';


const node = document.getElementById('app') as any;

document.body.style.overflow = 'hidden';

node.style.width = '100vw';
node.style.height = '100vh';
node.style.display = 'flex';
node.style.flexDirection = 'column';
node.style.alignItems = 'center';
node.style.justifyContent = 'center';

const root = ReactDOM.createRoot(node);


/* Plugins */

const useRouter = () => {
  const [socket] = useSocket();

  return [(
    <Socket socket={socket} wrapper={(data) => (
      <BrowserRouter key="router">
        <Routes>
          {data}
        </Routes>
      </BrowserRouter>
    )}  />
  ), socket];
};

const useAuth = (socket) => {
  const [name, setName] = React.useState('value');
  const [authFields] = useSocket();

  return [(
    <Extension name="auth" socket={socket}>
      <Route path="/auth" element={(
        <Card style={{ padding: 12 }}>
          <Input value={name} onChange={setName} />
          <Socket socket={authFields} />
        </Card>
      )} />
    </Extension>
  ), authFields, { name }];
};

const usePassword = ([authFields, { name }]: any, router) => {
  const [password, setPassword] = React.useState('');

  return [(
    <>
      <Extension socket={authFields} name="password">
        <Input value={password} onChange={setPassword} />
        <Button>Login, {name}</Button>
      </Extension>

      <Extension socket={router} name="password">
        <Route path="/password" element={<Input value={password} onChange={setPassword} />} />
      </Extension>
    </>
  )];
};


/* Entry point */

const App = () => {
  const [$routes, router] = useRouter();
  const [$auth, ...auth] = useAuth(router);
  const [$pass] = usePassword(auth, router);

  // We should list them in a reverse order
  return (<>{$pass} {$auth} {$routes}</>);
};

root.render(
  <App />
);
