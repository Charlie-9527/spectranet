import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SpectralChartProps {
  wavelengths: number[];
  intensities: number[];
  label?: string;
  color?: string;
}

export default function SpectralChart({ 
  wavelengths, 
  intensities, 
  label = 'Spectral Signature',
  color = 'rgb(14, 165, 233)'
}: SpectralChartProps) {
  const data = {
    labels: wavelengths.map(w => w.toFixed(1)),
    datasets: [
      {
        label,
        data: intensities,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.1,
        pointRadius: wavelengths.length > 100 ? 0 : 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Spectral Signature',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Wavelength (nm)',
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Intensity / Reflectance',
        },
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
}
