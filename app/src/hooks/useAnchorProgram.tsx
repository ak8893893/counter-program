import { useEffect, useState } from "react";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { MyProgram } from "idl/my_program";
import idlFile from "../idl/my_program.json";

export default function useAnchorProgram(): Program<MyProgram> {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<MyProgram> | null>(null);

  const idl = idlFile as Idl;

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      const programInstance = new Program(idl, idl.metadata.address, provider);
      setProgram(programInstance as unknown as Program<MyProgram>);
    }
  }, [wallet, connection, idl]);

  return program as Program<MyProgram>;
}
