import fetch from "isomorphic-unfetch";

const Index = ({ devices }) => (
  <>
    <ul>
      {devices.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  </>
);

Index.getInitialProps = async function() {
  const response = await fetch("https://gergos-smart-home-server.herokuapp.com/devices");
  const devices = await response.json();

  return {
    devices
  };
};

export default Index;
