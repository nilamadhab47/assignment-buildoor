import { render, fireEvent, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';

// Import the component that uses the connectWallet function
// import MyComponent from './MyComponent';
import App from './App';

// Mock the web3Modal object
jest.mock('web3modal', () => ({
  connect: jest.fn().mockResolvedValue('fakeConnection'),
}));

// Mock the window object
global.window = {
  alert: jest.fn(),
  ethereum: null,
};

describe('App', () => {
  test('connects wallet successfully', async () => {
    // Render the component
    const { getByTestId } = render(<App />);

    // Mock the window.ethereum object
    global.window.ethereum = {};

    // Click the connect button
    const connectButton = getByTestId('connect-button');
    fireEvent.click(connectButton);

    // Wait for the connection to be established
    await waitFor(() => expect(ethers.providers.Web3Provider).toHaveBeenCalledWith('fakeConnection', 'any'));

    // Check that the wallet, connection, provider, balance, and wallets state have been set correctly
    expect(getByTestId('wallet')).toHaveTextContent('fakeAddress');
    // expect(getByTestId('balance')).toHaveTextContent('0.00');
    // expect(getByTestId('wallets')).toHaveTextContent('fakeAddress');
  });

  test('shows alert message when MetaMask is not installed', async () => {
    // Render the component
    const { getByTestId } = render(<App />);

    // Click the connect button
    const connectButton = getByTestId('connect-button');
    fireEvent.click(connectButton);

    // Check that the alert message is displayed
    expect(global.window.alert).toHaveBeenCalledWith('To interact with this platform, please install the MetaMask browser extension.');
  });

  test('handles error when connecting wallet', async () => {
    // Mock the web3Modal object to reject the connection
    jest.spyOn(web3Modal, 'connect').mockRejectedValue(new Error('Connection failed'));

    // Render the component
    const { getByTestId } = render(<App />);

    // Mock the window.ethereum object
    global.window.ethereum = {};

    // Click the connect button
    const connectButton = getByTestId('connect-button');
    fireEvent.click(connectButton);

    // Wait for the error to be logged
    await waitFor(() => expect(console.error).toHaveBeenCalled());

    // Check that the error message is displayed
    expect(getByTestId('error')).toHaveTextContent('Connection failed');
  });
});
