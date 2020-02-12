import fetch from "isomorphic-unfetch";
import { useState, useReducer } from "react";
import cookie from 'js-cookie';
import Time from '../components/Time';
import devicesReducer, { reduceDevicesState } from './devicesReducer';
import { Dashboard, Label, NumDisplay, Row, Button, Lamp } from "../components";


const baseUrl = `https://gergos-smart-home-server.herokuapp.com`;

const fetchDeviceData = async () => {
  const response = await fetch(`${baseUrl}/devices`);
  const devicesState = await response.json();
  return {
    devicesState
  };
}

const Index = ({ devicesState: initialDevicesState, router }) => {
  const apikey = cookie.get('apikey');
  const [ak, setApiKey] = useState(null)
  const [state, dispatch] = useReducer(devicesReducer, initialDevicesState, reduceDevicesState);

  const handleRefresh = async () => {
    try {
      dispatch({ type: 'UPDATE_DEVICES__REQUEST'})
      const { devicesState: payload } = await fetchDeviceData()
      dispatch({ type: 'UPDATE_DEVICES__SUCCESS', payload })
    } catch(error){
      dispatch({ type: 'UPDATE_DEVICES__ERROR', payload: error.message })
    }
  }

  const handleTempChange = async diff => {
    const { setTemp } = state.thermostat;
    const newTemp = Math.round((setTemp + diff)* 10)/10;
    dispatch({ type: 'SET_DEVICE', payload: {
      thermostat: {
        setTemp: newTemp
      }
    }})
    try {
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
    } catch(error){
      dispatch({ type: 'SET_DEVICE', payload: {
        thermostat: {
          setTemp
        }
      }})
      dispatch({ type: 'SET_DEVICE__ERROR', payload: error.message })      
    }
  }

  const handleErrorClick = () => {
    dispatch({ type: 'ERROR_ACK' })
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
      {state.error && <ErrorBox onClick={handleErrorClick}>{state.error}</ErrorBox>}
      <Label>room temp</Label>
      <NumDisplay>{state['living-room-thermometer']['temp']}</NumDisplay>
      <Time utc={state['living-room-thermometer']['updatedAt']} />
      <br />
      <br />
      <Label>set temp</Label>
      <Row>
        <Button onClick={() => handleTempChange(-0.1)}>-</Button>
        <NumDisplay>{state['thermostat']['setTemp']}</NumDisplay>
        <Button onClick={() => handleTempChange(+0.1)}>+</Button>
      </Row>
      <br />
      <br />
      <Label>boiler</Label>
      <Lamp on={state['boiler']['relay']} />
      <br />
      <br />
      <Row>
        <Button state={state.loading} onClick={handleRefresh}>
          <span>↺</span>
        </Button>
      </Row>
    </Dashboard>  
  )
}

Index.getInitialProps = fetchDeviceData;

export default Index;
