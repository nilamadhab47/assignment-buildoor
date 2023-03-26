import { useState } from "react";
import avatar from "../images/avatar.jpg";

export default function WalletList({ wallets, removeWallet }) {
  console.log(wallets);
  return (
    <div>
      <ul className="d-flex details-div">
        {wallets.map((wallet) => (
          <div className="details">
            <li key={wallet} className="list-users">
              <div className="pulsating-circle"></div>

              <span className="wallet" id="wallet">{`${wallet.substring(
                0,
                2
              )}...${wallet.substring(wallet.length - 2)}`}</span>
              <div
                className="button offline-button"
                onClick={() => removeWallet(wallet)}
              >
                <p className="btnText">Offline</p>
                <div className="btnTwo">
                  <p className="btnText2">GO!</p>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
