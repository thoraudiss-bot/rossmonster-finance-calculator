import { FinanceCalculator } from './components/FinanceCalculator';

export default function App() {
  return (
    <div className="size-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <FinanceCalculator />
    </div>
  );
}