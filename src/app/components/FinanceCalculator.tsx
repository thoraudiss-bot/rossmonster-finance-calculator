import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calculator, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';

export function FinanceCalculator() {
  const [totalPrice, setTotalPrice] = useState<string>('233983');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [loanYears, setLoanYears] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('6.90');

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

  const { avgMonthlyPayment, totalPaid, loanAmount, downPayment } = calculateMonthlyPayment();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const yearOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
  const maxYears = parseInt(loanYears);

  return (
    <Card className="w-full max-w-2xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#2E5060] to-[#3A4A2E] text-white pb-8">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          RV Finance Calculator
        </CardTitle>
        <CardDescription className="text-[#D9D0BC]">
          Calculate your estimated monthly payment with our flexible financing options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6" style={{ backgroundColor: '#F5F2ED' }}>
        <Alert className="bg-[#D9D0BC]">
          <Info className="h-4 w-4 text-[#2E5060]" />
          <AlertDescription className="text-[#2E5060] text-sm">
            <strong>Note:</strong> RV loans require a minimum of 10% down payment. We recommend 20% for better rates. Interest rates vary by bank and this calculator is only meant to be used to get an idea on what financing might look like.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[#2E5060] font-semibold">RV Price</Label>
              <Input
                id="price"
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="233983"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanYears" className="text-[#2E5060] font-semibold">Loan Term (Years)</Label>
              <Select value={loanYears} onValueChange={setLoanYears}>
                <SelectTrigger id="loanYears">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year}>
                      {year} {year === '1' ? 'Year' : 'Years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="downpayment" className="text-[#2E5060] font-semibold">Down Payment (%)</Label>
            <div className="flex gap-2">
              <Input
                id="downpayment"
                type="number"
                min="10"
                max="100"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(e.target.value)}
                placeholder="20"
              />
              <div className="flex items-center bg-[#D9D0BC] px-4 rounded-md min-w-[140px] justify-end">
                <span className="font-semibold text-[#2E5060]">{formatCurrency(downPayment)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate" className="text-[#2E5060] font-semibold">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        {/* Payment Summary */}
        <Card className="bg-gradient-to-br from-[#2E5060] to-[#3A4A2E] shadow-lg text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-3">
              <span className="text-sm text-[#D9D0BC]">Estimated Monthly Payment:</span>
              <span className="text-3xl font-bold text-[#B07D3A]">{formatCurrency(avgMonthlyPayment)}</span>
            </div>
            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#D9D0BC]">RV Price:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(totalPrice) || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#D9D0BC]">Down Payment ({downPaymentPercent}%):</span>
                <span className="font-semibold text-[#B07D3A]">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#D9D0BC]">Loan Amount:</span>
                <span className="font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}