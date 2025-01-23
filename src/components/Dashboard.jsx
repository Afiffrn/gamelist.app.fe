import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ handleLogout }) => {
  const [totalGames, setTotalGames] = useState(0);
  const [gamesByYear, setGamesByYear] = useState({});
  const [topGames, setTopGames] = useState([]); // State for top games
  const [activeIndex, setActiveIndex] = useState(null); // State for accordion

  const fetchGames = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://gamelist-api.vercel.app/api/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data && data.data && data.data.games) {
          setTotalGames(data.data.games.length);
          processGamesByYear(data.data.games);
          setTopGames(getTopRatedGames(data.data.games)); // Get top rated games based on score
        } else {
          Swal.fire("Error", "Unexpected response structure.", "error");
        }
      } else {
        Swal.fire("Error", "Failed to fetch games. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching games.", "error");
    }
  };

  const processGamesByYear = (games) => {
    const yearCount = {};
    games.forEach(game => {
      const year = game.released;
      if (year > 1970) {
        yearCount[year] = (yearCount[year] || 0) + 1;
      }
    });

    const sortedYearCount = Object.entries(yearCount).sort(([yearA], [yearB]) => yearA - yearB);
    const sortedYears = sortedYearCount.map(([year]) => year);
    const sortedCounts = sortedYearCount.map(([, count]) => count);

    setGamesByYear({ years: sortedYears, counts: sortedCounts });
  };

  const getTopRatedGames = (games) => {
    return games
      .filter(game => game.score > 0) // Adjust this condition as needed
      .sort((a, b) => b.score - a.score) // Sort by score in descending order
      .slice(0, 5); // Get the top 5 games
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const chartData = {
    labels: gamesByYear.years || [],
    datasets: [
      {
        label: 'Number of Games',
        data: gamesByYear.counts || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Games by Year',
        color: 'white',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center bg-[#121212] p-4">
      <main className="flex-1 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb -4 text-shadow">Dashboard</h1>
        <div className="chart-container mb-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 text-shadow">Top 5 Games</h2>
        <div className="accordion w-full">
          {topGames.map((game, index) => (
            <div key={game.id} className="card mb-2 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="card-header cursor-pointer p-4 flex justify-between items-center" onClick={() => toggleAccordion(index)}>
                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                <span className="text-gray-400">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="card-body bg-gray-800 p-2 flex justify-around ">
                  <p className="text-gray-300">Score: {game.score}</p>
                  <p className="text-gray-300">Released: {game.released}</p>
                  <p className="text-gray-300">Rating: {game.rating}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
