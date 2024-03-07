import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { assert } from "chai";

// 定義測試集 "counter-program"
describe("counter-program", () => {
  // 配置客戶端使用本地集群（或根據環境變量配置的集群）
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // 獲取CounterProgram的程序引用，用於後續的方法調用
  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;
  
  // 生成一個新的Keypair用於我的計數器賬戶
  const myCounter = anchor.web3.Keypair.generate();

  // 測試用例：創建並初始化我的計數器
  it("Creates and initializes my counter", async () => {
    // 調用initialize方法初始化計數器，設置初始值為1234
    const tx = await program.methods
      .initialize(new anchor.BN(1234))
      .accounts({
        myCounter: myCounter.publicKey, // 指定計數器賬戶
        user: provider.wallet.publicKey, // 調用者賬戶
        systemProgram: anchor.web3.SystemProgram.programId, // 系統程序ID，用於創建賬戶等操作
      })
      .signers([myCounter]) // 簽名者列表，這裡需要myCounter的簽名
      .rpc();
    console.log("Initialize transaction signature:", tx);
    console.log(`SolScan transaction link: https://solscan.io/tx/${tx}?cluster=devnet`);
    

    // 驗證計數器賬戶的值是否正確設置為1234
    const account = await program.account.myCounter.fetch(myCounter.publicKey);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1234)));
  });

  // 測試用例：向我的計數器添加一個偶數
  it("Add an even number to my counter", async () => {
    // 調用addEven方法，向計數器添加420
    const tx = await program.methods
      .addEven(new anchor.BN(420))
      .accounts({
        myCounter: myCounter.publicKey, // 指定計數器賬戶
      })
      .rpc();
    console.log("AddEven transaction signature:", tx);
    console.log(`SolScan transaction link: https://solscan.io/tx/${tx}?cluster=devnet`);

    // 驗證計數器賬戶的值是否正確更新
    const account = await program.account.myCounter.fetch(myCounter.publicKey);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1654)));
  });

  // 測試用例：從我的計數器減去一個奇數
  it("Minus an odd number from my counter", async () => {
    // 調用minusOdd方法，從計數器減去69
    const tx = await program.methods
      .minusOdd(new anchor.BN(69))
      .accounts({
        myCounter: myCounter.publicKey, // 指定計數器賬戶
      })
      .rpc();
    console.log("MinusOdd transaction signature:", tx);
    console.log(`SolScan transaction link: https://solscan.io/tx/${tx}?cluster=devnet`);

    // 驗證計數器賬戶的值是否正確更新
    const account = await program.account.myCounter.fetch(myCounter.publicKey);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(1585)));
  });

  // 測試用例：向我的計數器乘上一個偶數
  it("Times an even number to my counter", async () => {
    // 調用addEven方法，向計數器乘上30
    const tx = await program.methods
      .timesEven(new anchor.BN(30))
      .accounts({
        myCounter: myCounter.publicKey, // 指定計數器賬戶
      })
      .rpc();
    console.log("TimesEven transaction signature:", tx);
    console.log(`SolScan transaction link: https://solscan.io/tx/${tx}?cluster=devnet`);

    // 驗證計數器賬戶的值是否正確更新
    const account = await program.account.myCounter.fetch(myCounter.publicKey);
    console.log("The account counter is",account.value.toString(10), "now ");
    assert.ok(account.value.eq(new anchor.BN(47550)));
  });
});
