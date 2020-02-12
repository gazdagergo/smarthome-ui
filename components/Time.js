import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const TimeWrap = styled.div``

export default ({ utc }) => (
  <TimeWrap>
    {moment(utc).fromNow()}
  </TimeWrap>
)
