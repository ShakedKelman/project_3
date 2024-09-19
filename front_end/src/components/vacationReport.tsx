import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { selectVacations } from '../store/slices/followersSlice';
import { getFollowersForVacation } from '../api/followers/follower-api';

// Import Chart.js components and register them
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

const Report: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const vacations = useSelector(selectVacations);
    const [data, setData] = useState<{ destination: string; followers: number }[]>([]);

    const isAdmin = user?.isAdmin;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reportData = await Promise.all(vacations.map(async (vacation) => {
                    if (vacation.id === undefined) {
                        return {
                            destination: vacation.destination,
                            followers: 0,
                        };
                    }

                    const vacationFollowers = await getFollowersForVacation(vacation.id);
                    return {
                        destination: vacation.destination,
                        followers: vacationFollowers.length,
                    };
                }));
                setData(reportData);
            } catch (error) {
                console.error('Error fetching vacation followers:', error);
            }
        };

        fetchData();
    }, [vacations]);

    const chartData = {
        labels: data.map(item => item.destination),
        datasets: [
            {
                label: 'Number of Followers',
                data: data.map(item => item.followers),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, 'vacation_report.xlsx');
    };

    return (
        <div>
            <h2>Vacation Report</h2>
            <Line data={chartData} />
            <div>
                <button onClick={handleExportExcel}>Export to Excel</button>
                <CSVLink data={data} filename="vacation_report.csv">
                    Export to CSV
                </CSVLink>
            </div>
        </div>
    );
};

export default Report;
