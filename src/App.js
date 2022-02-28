import { useEffect, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(async () => {
    setMessage("loading ...");
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
    setCurrentAccount(accounts[0]);
    setMessage("success");
  }, []);

  const enterContract = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Loading ...");

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(betAmount, "ether"),
      });
      setMessage("Entered into contact successfully");
    } catch (err) {
      setMessage("Got error while entering contact");
    }
  };

  const picWinner = async () => {
    setMessage("loading ...");
    await lottery.methods.pickWinner().send({
      from: currentAccount,
    });
    setMessage("Winner has been picked!");
  };

  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>
        This Contract is managed by {manager}. There are currenly{" "}
        {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />

      <div>
        <h4>Try out your lock!</h4>
        Enter the ether that you want to bet{" "}
        <input
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <button onClick={enterContract}>Enter to Contract</button>
      </div>

      <hr />

      {currentAccount == manager && (
        <div>
          <h4>Time to pick winner</h4>
          Only manager can perform this action
          <button onClick={picWinner}>Pick Winner</button>
        </div>
      )}

      <p>Message: {message}</p>
    </div>
  );
}

export default App;
