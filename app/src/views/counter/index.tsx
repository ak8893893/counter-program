import { FC, useEffect, useState } from "react";
import { InitializeCounter } from "../../components/InitializeCounter";
import { useCounter } from "contexts/CounterProvider";
import { AddEvenToCounter } from "components/AddEvenToCounter";
import { MinusOddToCounter } from "components/MinusOddToCounter";
import { CloseCounter } from "components/CloseCounter";
import useAnchorProgram from "hooks/useAnchorProgram";
import { TimesEvenToCounter } from "components/TimesEvenToCounter";

export const CounterView: FC = ({}) => {
  const [counterValue, setCounterValue] = useState<number>(-1);
  const { counterAddress } = useCounter();
  const program = useAnchorProgram();

  useEffect(() => {
    const fetchCounterValue = async () => {
      if (program && counterAddress) {
        const myCounter = await program.account.myCounter.fetchNullable(
          counterAddress
        );
        setCounterValue(
          myCounter && myCounter.value ? Number(myCounter.value) : -1
        );
      }
    };
    fetchCounterValue();
  }, [program, counterAddress]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          My Counter Program
        </h1>
        {/* CONTENT GOES HERE */}
        <h3 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-emerald-300 mt-3 mb-1">
          My Counter Address: {counterAddress.toBase58()}
        </h3>
        <h3 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-emerald-300 mt-1 mb-2">
          value: {counterValue != -1 ? counterValue : "Not Initialized"}
        </h3>
        <div className="text-center">
          <InitializeCounter setCounterValue={setCounterValue} />
          <AddEvenToCounter setCounterValue={setCounterValue} />
          <MinusOddToCounter setCounterValue={setCounterValue} />
          <TimesEvenToCounter setCounterValue={setCounterValue} />
          <CloseCounter setCounterValue={setCounterValue} />
        </div>
      </div>
    </div>
  );
};
