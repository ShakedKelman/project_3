import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';  // Import Bar chart instead of Line chart
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
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
    BarElement,
} from 'chart.js';
import { VacationModel } from '../model/VacationModel';
import { getVacations } from '../api/vactions/vactions-api';
import { Button } from 'react-bootstrap';

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement
);

interface VacationsProps {
    token?: string;
 }


const Report: React.FC<VacationsProps> = (props) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const vacations = useSelector(selectVacations);
    const [data, setData] = useState<{ destination: string; followers: number }[]>([]);
    const [allVacations, setAllVacations] = useState<VacationModel[]>([]);

    const isAdmin = user?.isAdmin;
    const { token } = props;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vacations = await getVacations(undefined, token);
                setAllVacations(vacations);

                const reportData = await Promise.all(vacations.map(async (vacation) => {
                    if (vacation.id === undefined) {
                        return {
                            destination: vacation.destination,
                            followers: 0,
                        };
                    }

                    const vacationFollowers = await getFollowersForVacation(vacation.id, token);
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
                barThickness: 35, // Adjust this to control the thickness of the bars
            },
        ],
    };
    const chartOptions = {
        scales: {
            x: {
                type: 'category' as const, // Use 'as const' to ensure the type is correctly inferred
                ticks: {
                    autoSkip: false, // Ensures all labels are displayed
                    maxRotation: 90, // Rotates labels if they are too long
                    minRotation: 0, // Minimum rotation
                },
                grid: {
                    display: false, // Hide grid lines to emphasize the vertical bars
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    display: true, // Ensure grid lines are visible
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };
    
    
    

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, 'vacation_report.xlsx');
    };

    return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                width: '100vw',
                overflow: 'auto'
            }}>
                <div style={{ 
                    width: '700px', 
                    height: '700px', 
                    overflow: 'auto'
                }}>
                    <h2>Vacation Report</h2>
                    <Bar data={chartData} options={chartOptions} />
                    <div>
                    <Button 
                        variant="primary" 
                        className="me-2" 
                        onClick={handleExportExcel}
                    >
                        Export to Excel
                    </Button>                        <CSVLink 
                        data={data} 
                        filename="vacation_report.csv"
                    >
                        <Button variant="success">Export to CSV</Button>
                    </CSVLink>
                    </div>
                </div>
            </div>
        );
    };
    

export default Report;
