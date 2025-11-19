import { CheckCircle, XCircle, GitCommit } from 'lucide-react';

const historyData = [
  { id: 103, service: 'demo-api', ver: 'v1.1.0', time: 'Just now', status: 'success', author: 'User', strategy: 'Canary', comment: 'Performance improved by 15%' },
  { id: 102, service: 'demo-frontend', ver: 'v2.1.0', time: '1 day ago', status: 'success', author: 'User', strategy: 'Blue-Green', comment: 'UI update' },
  { id: 101, service: 'demo-api', ver: 'v1.0.9', time: '3 days ago', status: 'failed', author: 'User', strategy: 'Rolling', comment: 'Failed due to unit test error' },
];

export default function HistoryPage() {
  return (
    <div className="h-full overflow-y-auto bg-stone-50 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Deployment Journal 📜</h2>
        <p className="text-slate-500">Track all gardening activities and growth records.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Service / Version</th>
              <th className="px-6 py-4 font-bold">Strategy</th>
              <th className="px-6 py-4 font-bold">AI Summary</th>
              <th className="px-6 py-4 font-bold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {historyData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  {item.status === 'success' 
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700"><CheckCircle size={12}/> Success</span>
                    : <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700"><XCircle size={12}/> Failed</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{item.service}</div>
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <GitCommit size={12} /> {item.ver}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{item.strategy}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                    {item.comment}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {item.time} by <b>{item.author}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}