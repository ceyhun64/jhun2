"use client";
import {

  Trash2,
} from "lucide-react";


interface Stats {
  learned: number;
  conversations: number;
  confidence: number;
}

export default function StatsPanel({
  stats,
  onReset,
}: {
  stats: Stats;
  onReset: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
      <h4 className="font-semibold text-sm mb-2">📊 Öğrenme İstatistikleri</h4>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white p-2 rounded-lg text-center">
          <div className="font-bold text-blue-600">{stats.learned}</div>
          <div className="text-gray-600">Öğrenildi</div>
        </div>
        <div className="bg-white p-2 rounded-lg text-center">
          <div className="font-bold text-purple-600">{stats.conversations}</div>
          <div className="text-gray-600">Konuşma</div>
        </div>
        <div className="bg-white p-2 rounded-lg text-center">
          <div className="font-bold text-green-600">{stats.confidence}%</div>
          <div className="text-gray-600">Güven</div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="mt-2 w-full bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
      >
        <Trash2 className="w-3 h-3" />
        Verileri Sıfırla
      </button>
    </div>
  );
}
