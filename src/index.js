import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/App';
import './index.css';

// 创建 Redux store（简单占位）
const store = createStore((state = {}) => state);

// 获取 root 元素
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// 使用 createRoot 渲染
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
