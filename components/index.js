import styled from 'styled-components';

// only styled components

export const Dashboard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`

export const Label = styled.label`
  font-size: 22px;
  color: #AAA;
`

export const NumDisplay = styled.span`
  font-size: 36px;
`

export const Button = styled.button`
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
  &:focus {
    outline: none;
  }
  ${({ state }) => {
    if (state === 'loading') return 'animation: spin 3s linear infinite;'
    if (state === 'done') return 'animation: done 3s ease-out;'
  }}
`

export const Lamp = styled.div`
  background: ${({ on }) => on ? 'orange' : 'gray' };
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const ErrorBox = styled.div`
  position: fixed;
  top: 12px;
  background: lightsalmon;
  padding: 4px 8px;
  border-radius: 8px;
  color: darkred;
  cursor: pointer;
`