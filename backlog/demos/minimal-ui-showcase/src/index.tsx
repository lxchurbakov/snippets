import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import Layout from './pages/layout';
import MainPage from './pages/main';
import MessagesPage from './pages/messages';
import ClusterPage from './pages/cluster';

const node = document.getElementById('app') as any;

document.body.style.overflow = 'hidden';

node.style.width = '100vw';
node.style.height = '100vh';
node.style.display = 'flex';
node.style.flexDirection = 'column';
node.style.alignItems = 'center';
node.style.justifyContent = 'center';

const root = ReactDOM.createRoot(node);

root.render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/cluster" element={<ClusterPage />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
