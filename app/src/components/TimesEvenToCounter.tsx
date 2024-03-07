import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import { useCounter } from "contexts/CounterProvider";
import useAnchorProgram from "hooks/useAnchorProgram";

interface TimesEvenToCounterProps {
  setCounterValue: (value: number) => void;
}
export const TimesEvenToCounter: FC<TimesEvenToCounterProps> = ({
  setCounterValue,
}) => {
  const { counterAddress } = useCounter();
  const program = useAnchorProgram();
  const wallet = useAnchorWallet();

  const onClick = useCallback(async () => {
    if (!wallet.publicKey || !program) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature = "";
    try {
      const txid = await program.methods
        .timesEven(new BN(30))
        .accounts({
          myCounter: counterAddress,
          user: wallet.publicKey,
        })
        .rpc();
      const myCounter = await program.account.myCounter.fetch(counterAddress);
      setCounterValue(Number(myCounter.value));

      console.log(signature);
      notify({
        type: "success",
        message: "Add even transaction successful!",
        txid,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [wallet, notify, program]);

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>
        <button
          className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={onClick}
          disabled={!wallet}
        >
          <div className="hidden group-disabled:block ">
            Wallet not connected
          </div>
          <span className="block group-disabled:hidden">Times 30</span>
        </button>
      </div>
    </div>
  );
};
