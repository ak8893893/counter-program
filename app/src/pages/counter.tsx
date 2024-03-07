import type { NextPage } from "next";
import Head from "next/head";
import { CounterView } from "../views";

const Counter: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="My counter program" />
      </Head>
      <CounterView />
    </div>
  );
};

export default Counter;
