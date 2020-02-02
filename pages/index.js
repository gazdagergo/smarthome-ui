import fetch from "isomorphic-unfetch";
import { useState } from "react";
import styled from 'styled-components';

const Dashboard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

const Label = styled.label`
  font-size: 22px;
  color: #AAA;
`

const NumDisplay = styled.span`
  font-size: 36px;
`

const Button = styled.button`
  background: gray;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 24px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
  margin: 0 10px;
`

const Lamp = styled.div`
  background: ${({ on }) => on ? 'orange' : 'gray' };
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

// const { BASE_URL: baseUrl } = process.env;
const baseUrl = 'https://gergos-smart-home-server.herokuapp.com';

const Index = ({ devices }) => {
  const { params: { setTemp: initialDesiredTemp } } = devices.find(({ name }) => name === 'thermostat')
  const { params: { temp: initialMeasuredTemp } } = devices.find(({ name }) => name === 'living-room-thermometer')
  const { params: { relay } } = devices.find(({ name }) => name === 'boiler')

  const [desiredTemp, setDesiredTemp] = useState(initialDesiredTemp)
  const [measuredTemp, setMeasuredTemp] = useState(initialMeasuredTemp)

  const handleTempChange = async diff => {
    const newTemp = desiredTemp + diff;
    await fetch(`${baseUrl}/devices`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "params": {
        setTemp: newTemp
      }})      
    })
    setDesiredTemp(newTemp)
  }

  return (
    <Dashboard>
      <Label>room temp</Label>
      <NumDisplay>{measuredTemp}</NumDisplay>
      <br />
      <br />
      <Label>set temp</Label>
      <Row>
        <Button onClick={() => handleTempChange(-0.1)}>-</Button>
        <NumDisplay>{desiredTemp}</NumDisplay>
        <Button onClick={() => handleTempChange(+0.1)}>+</Button>
      </Row>
      <br />
      <br />
      <Label>Boiler</Label>
      <br />
      <Lamp on={relay} />
    </Dashboard>  
  )
}

Index.getInitialProps = async function() {
  const response = await fetch(`${baseUrl}/devices`);
  const devices = await response.json();

  return {
    devices
  };
};

export default Index;
