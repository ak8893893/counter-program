use anchor_lang::prelude::*;

// 宣告合約的ID
declare_id!("4zJZ6pYJ7VzqoUZzx1rXPYG1Zom6XDjNvGqMgWv8ryTJ");

// 定義主要的程序模塊
#[program]
pub mod counter_program {
    use super::*;

    // 初始化函數，設置計數器的初始值
    pub fn initialize(ctx: Context<Initialize>, value: u64) -> Result<()> {
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = value;
        
        Ok(())
    }

    // 添加偶數值到計數器，只接受偶數
    pub fn add_even (ctx: Context<AddEven>, value: u64) -> Result<()>{
        // 檢查值是否為偶數
        require!(value % 2 == 0, ErrorCode::ValueIsNotEven);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_add(value).unwrap();
        
        Ok(())
    }

    // 從計數器減去奇數值，只接受奇數
    pub fn minus_odd(ctx: Context<MinusOdd>,value: u64) -> Result<()>{
        // 檢查值是否為奇數
        require!(value % 2 == 1, ErrorCode::ValueIsNotOdd);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_sub(value).unwrap();

        Ok(())
    }

    // 從計數器乘上一個數，只接受偶數
    pub fn times_even(ctx: Context<TimesEven>,value: u64) -> Result<()>{
        // 檢查值是否為偶數
        require!(value % 2 == 0, ErrorCode::ValueIsNotEven);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_mul(value).unwrap();

        Ok(())
    }
}

// 定義初始化交易時需要的賬戶結構
#[derive(Accounts)]
pub struct Initialize<'info> {
    // 設定計數器賬戶的存儲空間
    #[account(init, payer= user, space = 8 + 8)]
    pub my_counter: Account<'info, MyCounter>,

    // 使用者賬戶，將支付創建計數器賬戶的費用
    #[account(mut)]
    pub user: Signer<'info>,
    // 系統程序
    pub system_program : Program<'info, System>,
}

// 添加偶數值到計數器的賬戶結構
#[derive(Accounts)]
pub struct AddEven<'info>{
    #[account(mut)]
    pub my_counter: Account<'info,MyCounter>,
}

// 從計數器減去奇數值的賬戶結構
#[derive(Accounts)]
pub struct MinusOdd<'info>{
    #[account(mut)]
    pub my_counter: Account<'info,MyCounter>,
}

// 添加計數器乘上偶數的賬戶結構
#[derive(Accounts)]
pub struct TimesEven<'info>{
    #[account(mut)]
    pub my_counter: Account<'info,MyCounter>,
}

// 定義計數器賬戶的結構，包含一個u64類型的值
#[account]
pub struct MyCounter{
    pub value:u64,
}

// 自定義錯誤代碼及其訊息
#[error_code]
pub enum ErrorCode {
    // 值不是偶數時的錯誤訊息
    #[msg("value is not even")]
    ValueIsNotEven,
    // 值不是奇數時的錯誤訊息
    #[msg("value is not odd")]
    ValueIsNotOdd,
}
