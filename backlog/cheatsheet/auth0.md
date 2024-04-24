Auth0

REACT_APP_AUTH0_DOMAIN=domain
REACT_APP_AUTH0_CLIENT_ID=client_id

+ add urls everywhere in auth0

import { Auth0Provider } from '@auth0/auth0-react';

<Auth0Provider domain={...} clientId={...} redirectUri={window.location.origin}>

// In component

import { useAuth0 } from '...';

const { user, logout, loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0(); // user - nickname, name, picture, updated_at, sub

// in BE

jwt middleware