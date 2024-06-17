// client/src/App.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Register from './components/Register';

const App = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/download/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `file.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await login(credentials.username, credentials.password);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h1>Excel File Upload and Download</h1>
      {!user && <Register />}
      {user ? (
        <>
          <button onClick={logout}>Logout</button>
          {user.role === 'uploader' && (
            <>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload</button>
            </>
          )}
          {user.role === 'downloader' && (
            <>
              <input
                type="text"
                placeholder="Enter file ID to download"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
              />
              <button onClick={handleDownload}>Download</button>
            </>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
