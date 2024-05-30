import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${fileId}`, {
        responseType: 'blob'
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

  return (
    <div>
      <h1>Excel File Upload and Download</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <br />
      <input
        type="text"
        placeholder="Enter file ID to download"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default App;


