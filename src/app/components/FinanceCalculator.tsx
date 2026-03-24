import { useState } from 'react';

export function FinanceCalculator() {
  const [totalPrice, setTotalPrice] = useState<string>('233983');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [downPaymentFocused, setDownPaymentFocused] = useState<boolean>(false);
  const [loanYears, setLoanYears] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('6.90');

  const formatNumberWithCommas = (value: string) => {
    const number = value.replace(/,/g, '');
    if (!number) return '';
    return parseFloat(number).toLocaleString('en-US');
  };

  const handleVehiclePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setTotalPrice(value);
    }
  };

  const calculateMonthlyPayment = (): { avgMonthlyPayment: number; totalPaid: number; loanAmount: number; downPayment: number } => {
    const price = parseFloat(totalPrice) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 0;
    const downPayment = (price * downPercent) / 100;
    const principalAmount = price - downPayment;

    const years = parseInt(loanYears) || 20;
    const months = years * 12;
    const rate = parseFloat(interestRate) || 0;
    const monthlyRate = rate / 100 / 12;

    let monthlyPayment = 0;
    let totalPaid = 0;

    if (monthlyRate > 0 && months > 0) {
      // Standard amortization formula
      monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                      (Math.pow(1 + monthlyRate, months) - 1);
      totalPaid = monthlyPayment * months;
    } else if (months > 0) {
      // If rate is 0, just divide by months
      monthlyPayment = principalAmount / months;
      totalPaid = principalAmount;
    }

    return {
      avgMonthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      loanAmount: principalAmount,
      downPayment: downPayment
    };
  };

  const { avgMonthlyPayment } = calculateMonthlyPayment();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const yearOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  return (
    <div className="relative rounded-[44px] w-full max-w-2xl overflow-hidden">
      {/* Background Image with Overlay */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[44px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[44px] size-full" src="/payment-calculator-bg.png" />
        <div className="absolute bg-[rgba(38,56,58,0.5)] inset-0 rounded-[44px]" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-10 sm:px-12 sm:py-16 md:px-[115px] md:py-[100px]">
        <div className="flex flex-col gap-[18px] w-full max-w-[457px]">
          {/* Title */}
          <h1 className="text-[#d4c5ae] text-[25.888px] leading-[28px] font-bold">
            Payment Calculator
          </h1>

          {/* Top Divider Line */}
          <div className="h-[2px] w-full">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 457 1">
              <line stroke="#A57548" x2="457" y1="0.5" y2="0.5" />
            </svg>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-[20px]">
            {/* Vehicle Price */}
            <div className="relative bg-[#3c5157] h-[46px] rounded-[10px]">
              <span className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#d4c5ae] text-[20px] pointer-events-none">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(totalPrice)}
                onChange={handleVehiclePriceChange}
                placeholder="Vehicle"
                className="absolute inset-0 w-full h-full bg-transparent text-[#d4c5ae] text-[20px] pl-[38px] pr-[24px] py-[10px] rounded-[10px] outline-none border-none"
              />
            </div>

            {/* Down Payment % */}
            <div className="relative bg-[#3c5157] h-[46px] rounded-[10px]">
              <input
                type="text"
                inputMode="numeric"
                value={downPaymentFocused ? downPaymentPercent : downPaymentPercent + '%'}
                onFocus={() => setDownPaymentFocused(true)}
                onBlur={() => setDownPaymentFocused(false)}
                onChange={(e) => {
                  const val = e.target.value.replace('%', '');
                  if (!isNaN(Number(val))) setDownPaymentPercent(val);
                }}
                className="absolute inset-0 w-full h-full bg-transparent text-[#d4c5ae] text-[20px] pl-[24px] pr-[120px] py-[10px] rounded-[10px] outline-none border-none"
              />
              <span className="absolute right-[24px] top-1/2 -translate-y-1/2 text-[#d4c5ae] text-[14px] font-semibold tracking-wide pointer-events-none opacity-70">Down Payment</span>
            </div>

            {/* Term and APR Side by Side */}
            <div className="flex justify-between gap-[23px]">
              {/* Term */}
              <div className="relative bg-[#3c5157] h-[46px] rounded-[10px] flex-1">
                <select
                  value={loanYears}
                  onChange={(e) => setLoanYears(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent text-[#d4c5ae] text-[20px] px-[24px] py-[10px] rounded-[10px] outline-none border-none appearance-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year} className="bg-[#3c5157]">
                      {year} {year === '1' ? 'Year' : 'Years'}
                    </option>
                  ))}
                </select>
              </div>

              {/* APR */}
              <div className="relative bg-[#3c5157] h-[46px] rounded-[10px] flex-1">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="APR"
                  step="0.01"
                  className="absolute inset-0 w-full h-full bg-transparent text-[#d4c5ae] text-[20px] pl-[24px] pr-[64px] py-[10px] rounded-[10px] outline-none border-none spinner-light"
                />
                <span className="absolute right-[28px] top-1/2 -translate-y-1/2 text-[#d4c5ae] text-[14px] font-semibold tracking-wide pointer-events-none opacity-70">APR</span>
              </div>
            </div>
          </div>

          {/* Monthly Payment */}
          <div className="flex justify-between items-center">
            <p className="text-[#d4c5ae] text-[20px]">Monthly Payment</p>
            <div className="flex items-center justify-center px-[20px] py-[9px] h-[48px] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
              <p className="text-[#d4c5ae] text-[20px] text-right">{formatCurrency(avgMonthlyPayment)}</p>
            </div>
          </div>

          {/* Bottom Divider Line */}
          <div className="h-[2px] w-full">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 457 1">
              <line stroke="#A57548" x2="457" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
