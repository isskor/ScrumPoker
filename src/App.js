import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import styled from 'styled-components';
import Chat from './components/Chat';
import Main from './components/Main';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './components/Login';
import { auth } from './firebase';
import { selectRoomId } from './features/appSlice';
import { useSelector } from 'react-redux';
import SideList from './components/SideList';

function App() {
  const [user, loading] = useAuthState(auth);

  const roomId = useSelector(selectRoomId);
  console.log('user', user);
  if (loading) {
    return (
      <AppLoading>
        <AppLoadingContents>
          <img src='' alt='' />
        </AppLoadingContents>
      </AppLoading>
    );
  }

  return (
    <Router>
      {!roomId ? (
        <Login />
      ) : (
        <>
          {user && user.displayName && (
            <>
              <Header />
              <AppBody>
                <Sidebar />
                <Switch>
                  <Route path='/' exact>
                    {/* Chat */}
                    <Main />
                  </Route>
                </Switch>
                <SideList />
              </AppBody>
            </>
          )}
        </>
      )}
    </Router>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  position: relative;
`;

const AppLoading = styled.div``;

const AppLoadingContents = styled.div``;
