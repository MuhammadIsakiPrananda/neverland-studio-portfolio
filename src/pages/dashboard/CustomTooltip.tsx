// src/pages/dashboard/components/CustomTooltip.tsx

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-lg shadow-lg text-sm">
        <p className="label text-slate-300 font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.stroke }}>
            {`${pld.name}: ${pld.value.toFixed(2)} ${pld.unit || ''}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};