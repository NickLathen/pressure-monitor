import React from 'react';

export default function Login(props) {
  const auth = props.auth;
  return (
    <div className='login'>
        <button onClick={auth.login.bind(this)}>Login</button>
    </div>
  );
}