import React from 'react';

export default function AppContainer(props) {
  let children = null;
  if (props.children) {
    children = React.cloneElement(props.children, {
      auth: props.route.auth //sends auth instance to children
    });
  }

  return (
    <div className='app-container'>
      {children}
    </div>
  );
} 