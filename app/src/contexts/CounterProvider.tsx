import { AnchorProvider, Idl, Program, utils } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import idlFile from "../idl/my_program.json";
import { createContext, FC, ReactNode, useContext } from "react";

export interface CounterContextState {
  counterAddress: PublicKey;
}

export const CounterContext = createContext<CounterContextState>(
  {} as CounterContextState
);

export function useCounter(): CounterContextState {
  return useContext(CounterContext);
}

export const CounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const idl = idlFile as Idl;

  const counterAddress = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("my-counter"),
      (wallet ? wallet.publicKey : PublicKey.default).toBuffer(),
    ],
    new PublicKey(idl.metadata.address)
  )[0];

  return (
    <CounterContext.Provider
      value={{
        counterAddress,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};
