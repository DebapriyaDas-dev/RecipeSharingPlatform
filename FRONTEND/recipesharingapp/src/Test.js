import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExampleComponent = () => {
  const notify = () => {
    toast.success('Hello, Toastify!');
  };

  return (
    <div>
      <button onClick={notify}>Show Toast</button>
      <ToastContainer />
    </div>
  );
};

export default ExampleComponent;
