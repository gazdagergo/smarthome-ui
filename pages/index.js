import fetch from "isomorphic-unfetch";
import { useState } from "react";
import styled from 'styled-components';
import cookie from 'js-cookie';
import Time from './Time';

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
  @keyframes spin { 100% { transform:rotate(-360deg) } }
  @keyframes done {
    0% { background: lightgreen }
    80% { background: lightgreen }
    100% { background: gray }
  }

  padding: 0px;
  background: gray;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  max-width: 30px;
  max-height: 30px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
  margin: 0 10px;
  box-sizing: border-box;
  &:active {
    background: lightgray;
  }
  ${({ state }) => {
    if (state === 'loading') return 'animation: spin 3s linear infinite;'
    if (state === 'done') return 'animation: done 3s ease-out;'
  }}
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

const ErrorBox = styled.div`
  position: fixed;
  top: 12px;
  background: lightsalmon;
  padding: 4px 8px;
  border-radius: 8px;
  color: darkred;
`

const baseUrl = `https://gergos-smart-home-server.herokuapp.com`;

const getDevices = async () => {
  try {
    const response = await fetch(`${baseUrl}/devices`);
    const devices = await response.json();
    return {
      devices
    };
  } catch(error){
    return { devices: null }
  }
}

const getDeviceValue = (devices, deviceName, paramName) => {
  return (
  devices && 
  devices.find && 
  devices.find(({ name }) => name === deviceName) &&
  devices.find(({ name }) => name === deviceName)['params'][paramName]
)
  }

const Index = ({ devices: initialDevices, router }) => {
  const apikey = cookie.get('apikey');
  const [devices, setDevices] = useState(initialDevices)
  const [ak, setApiKey] = useState(null)
  const [loadingState, setLoadingState] = useState(null)
  const [error, setError] = useState(null)

  const handleRefresh = async () => {
    setLoadingState('loading')
    const { devices } = await getDevices()
    if (!devices){
      setError('Error while refresh data')
      setLoadingState(null)
    } else {
      setDevices(devices);
      setLoadingState('done')
    }
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

  if (!apikey) {
    return (
      <Dashboard>
        <Label>Add your api key</Label>
        <input onChange={({ target: { value }}) => setApiKey(value)} />
        <br />
        <button onClick={() => {
          cookie.set('apikey', ak, { expires: 90 });
          router.push('/')
        }}>OK</button>
      </Dashboard>
    )
  }

  return (
    <Dashboard>
      {error && <ErrorBox>{error}</ErrorBox>}
      <Label>room temp</Label>
      <NumDisplay>{getDeviceValue(devices, 'living-room-thermometer', 'temp')}</NumDisplay>
      <Time utc={getDeviceValue(devices, 'living-room-thermometer', 'updatedAt')} />
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
      <Row>
        <Button state={loadingState} onClick={handleRefresh}>
          <span>↺</span>
        </Button>
      </Row>
    </Dashboard>  
  )
}

Index.getInitialProps = getDevices;

export default Index;
