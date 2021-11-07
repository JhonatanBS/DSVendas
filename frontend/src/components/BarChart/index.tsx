import Chart from 'react-apexcharts';
import axios from 'axios';
import { Base_URL } from 'utils/requests';
import { SaleSucess } from 'types/sale';
import { round } from 'utils/format';
import { useEffect, useState } from 'react';

type SeriesData = {
    name:string;
    data: number[];
}

type ChartData = {
    labels: {
        categories: string[];   
    };
    series:SeriesData[];
}

const BarChart = () => {

    const [charData, setChartData] = useState<ChartData>({

        labels: {
            categories: []
        },
        series: [
            {
                name: "",
                data: []                   
            }
        ]
    });

    useEffect(() => {
        axios.get(`${Base_URL}/sales/success-by-seller`)
        .then(response =>{
            const data = response.data as SaleSucess[];
            const myLabels = data.map(x => x.sellerName);
            const mySeries = data.map(x => round(100.0 * x.deals / x.visited,1));
    
            setChartData({

                labels: {
                    categories: myLabels
                },
                series: [
                    {
                        name: "% Success",
                        data: mySeries                   
                    }
                ]
            });  
        });
    },[]);

    const options = {
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
    };
    
    return (
        <Chart
           options = {{...options, xaxis:charData.labels}}
           series = {charData.series}
           type = "bar"
           height = "240"
        />
    );
}

export default BarChart;