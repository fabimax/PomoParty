import React from 'react';
import { useDispatch } from 'react-redux';
import { navigateTo } from '../store/store';

const SPALink = ({ href, style, children }) => {
  const dispatch = useDispatch();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        dispatch(navigateTo(href));
      }}
      style={style}
    >
      {children}
    </a>
  );
};

export default SPALink;

