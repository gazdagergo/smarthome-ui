import fetch from "isomorphic-unfetch";
import { useState } from "react";
import styled from 'styled-components';
import cookie from 'js-cookie';


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
  box-sizing: border-box;
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

const apikey = cookie.get('apikey');
const baseUrl = `https://gergos-smart-home-server.herokuapp.com`;

const getDevices = async () => {
  const response = await fetch(`${baseUrl}/devices`);
  const devices = await response.json();

  return {
    devices
  };
}

const getDeviceValue = (devices, deviceName, paramName) => {
  return (
  devices && devices.find && devices.find(({ name }) => name === deviceName)['params'][paramName]
)
  }

const Index = ({ devices: initialDevices }) => {

  const [devices, setDevices] = useState(initialDevices)

  const handleRefresh = async () => {
    const { devices } = await getDevices()
    setDevices(devices);
  }

  const handleTempChange = async diff => {
    const setTemp = getDeviceValue(devices, 'thermostat', 'setTemp');
    const newTemp = Math.round((setTemp + diff)* 10)/10;
    await fetch(`${baseUrl}/devices?name=thermostat`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      body: JSON.stringify({ "params": {
        setTemp: newTemp
      }})      
    })
    setDevices(devices.map(device => {
      if (device.name === 'thermostat') {
        return {...device, params: {...device.params, setTemp: newTemp }}
      }
      return device;
    }))
  }

  return (
    <Dashboard>
      <Label>room temp</Label>
      <NumDisplay>{getDeviceValue(devices, 'living-room-thermometer', 'temp')}</NumDisplay>
      <br />
      <br />
      <Label>set temp</Label>
      <Row>
        <Button onClick={() => handleTempChange(-0.1)}>-</Button>
        <NumDisplay>{getDeviceValue(devices, 'thermostat', 'setTemp')}</NumDisplay>
        <Button onClick={() => handleTempChange(+0.1)}>+</Button>
      </Row>
      <br />
      <br />
      <Label>boiler</Label>
      <Lamp on={getDeviceValue(devices, 'boiler', 'relay')} />
      <br />
      <br />
      <Button onClick={handleRefresh}>↺</Button>
    </Dashboard>  
  )
}

Index.getInitialProps = getDevices;

export default Index;
