import React, { useState, useEffect } from 'react';
import './App.css';
import './style.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { httpClient } from './HttpClient';
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: `http://localhost:${process.env.KEYCLOAK_PORT || 8080}`,
  realm: 'app-realm',
  clientId: 'myclient',
});

function App() {
  const [initialized, setInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: true,
      pkceMethod: 'S256',
    }).then(authenticated => {
      if (authenticated) {
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
        setIsAdmin(keycloak.hasRealmRole('admin'));
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(5).then(refreshed => {
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
          });
        };
      } else {
        window.location.reload();
      }
    }).catch(() => {
      console.error('Authentication Failed');
    }).finally(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return isAdmin ? <AdminPage /> : <UserPage />;
}

function UserPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await httpClient.post(`/message`, { message });
      alert(res.data.status || res.data.error);
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Błąd podczas wysyłania wiadomości');
    }
  };


  return (
    <div className="container">
      <header>
        <h1>My Secured React App</h1>
        <Button onClick={() => keycloak.logout({ redirectUri: `http://localhost:${process.env.CLIENT_PORT || 9000}` })} label="Logout" severity="danger" />
      </header>
      <section className="messages">
        <h2>Redis Messages</h2>
        <form onSubmit={handleSubmit} className="p-flex p-ai-center">
          <input type="text" placeholder="Enter message" value={message} onChange={e => setMessage(e.target.value)} required />
          <Button type="submit" label="Send" className="p-ml-2 p-button-primary" />
        </form>
      </section>
    </div>
  );
}

function AdminPage() {
  const [messagesList, setMessagesList] = useState('');
  const [parsedToken, setParsedToken] = useState({});

  useEffect(() => {
    if (keycloak.authenticated) {
      setParsedToken(keycloak.tokenParsed);
    }
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await httpClient.get(`/messages`);
      setMessagesList(JSON.stringify(res.data.messages, null, 2));
    } catch (err) {
      console.error(err);
      setMessagesList('Błąd podczas pobierania wiadomości.');
    }
  };

  return (
    <div className="container admin">
      <header>
        <h1>Admin Panel</h1>
        <Button onClick={() => keycloak.logout({ redirectUri: `http://localhost:${process.env.CLIENT_PORT || 9000}` })} label="Logout" severity="danger" />
      </header>
      <section className="token">
        <Card>
          <h2>Parsed Token</h2>
          <pre>{JSON.stringify(parsedToken, null, 2)}</pre>
        </Card>
      </section>
      <section className="messages">
        <h2>Redis Messages</h2>
        <Button onClick={fetchMessages} label="Refresh Messages" className="p-button-outlined" />
        <pre className="result">{messagesList}</pre>
      </section>
    </div>
  );
}

export default App;