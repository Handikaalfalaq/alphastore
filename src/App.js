import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Admin from './pages/admin';
import PageAuth from './pages/pageAuth';
import PrivateRoute from './utils/privateRoute';
import store from './config/redux/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PageAuth />} />
            <Route path="/admin/*" element={<PrivateRoute />}>
              <Route index element={<Admin />} />
            </Route>

 
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
