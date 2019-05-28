import React from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

const getOpacity = status => {
  if (status === 'entering') {
    return 0.5;
  }
  if (status === 'exited') {
    return 0;
  }
  return 0.5;
};

const TouchScroll = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  //z-index: -1;

  :before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
`;

const ScrollBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  opacity: ${({ status }) => getOpacity(status)};
  transition: opacity 0.3s ease-in;
  height: 100%;
  width: 100%;
`;

const ScrollContent = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
`;

const ScrollWrapper = ({ show, text, setShowWrapper }) => (
  <Transition
    in={show}
    timeout={{
      enter: 10,
      exit: 300,
    }}
    unmountOnExit
  >
    {status => (
      <TouchScroll onMouseLeave={setShowWrapper(false)}>
        <ScrollBg status={status} />
        <ScrollContent>{text}</ScrollContent>
      </TouchScroll>
    )}
  </Transition>
);

export default ScrollWrapper;
