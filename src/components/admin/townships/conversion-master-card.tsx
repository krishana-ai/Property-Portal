"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { initialConversionRates, type ConversionRate } from "@/lib/mock/townships";

export function ConversionMasterCard() {
  const [rates, setRates] = useState<ConversionRate[]>(initialConversionRates);

  function updateRate(unit: string, value: number) {
    setRates((prev) => prev.map((r) => (r.unit === unit ? { ...r, sqftEquivalent: value } : r)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Conversion Master</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="pb-2">Unit</th>
              <th className="pb-2">1 unit = ? Sq.ft</th>
              <th className="pb-2">Preview (10 units)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map((rate) => (
              <tr key={rate.unit}>
                <td className="py-2 font-medium text-slate-900">{rate.unit}</td>
                <td className="py-2">
                  <input
                    type="number"
                    value={rate.sqftEquivalent}
                    onChange={(e) => updateRate(rate.unit, Number(e.target.value))}
                    className="h-8 w-28 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </td>
                <td className="py-2 text-slate-500">
                  ≈ {(rate.sqftEquivalent * 10).toLocaleString()} sq.ft
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
