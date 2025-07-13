import axios from "axios";
import FleetPieChart from "./FleetPieChart";
import SalesBarChart from "./SalesBarChart";
import SalesLineChart from "./SalesLineChart";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { useState } from "react";
import { useEffect, useRef } from "react";

export default function Dashboard() {
  const currentMonth = new Date().getMonth() + 1;

  const [Month, setMonth] = useState(currentMonth);
  async function fetchData(api) {
    try {
      const response = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          Month: Month,
        },
      });
      console.log(response?.data);

      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  const { data: maintenanceCost, isLoading: maintenanceCostIsloading } =
    useQuery({
      queryKey: ["maintenanceCost", Month],
      queryFn: () =>
        fetchData(
          "https://veemanage.runasp.net/api/Dashboard/Total-Maintenance-Cost"
        ),
    });
  const { data: fuelCost, isLoading: fuelCostIsloading } = useQuery({
    queryKey: ["fuelCost", Month],
    queryFn: () =>
      fetchData("https://veemanage.runasp.net/api/Dashboard/Total-Fuel-Cost"),
  });
  const { data: TotalVehicles, isLoading: IsVehicelsLoading } = useQuery({
    queryKey: ["Vechiels"],
    queryFn: () =>
      fetchData("https://veemanage.runasp.net/api/Dashboard/Total-Vehicle"),
  });
  const { data: tripWithFaults, isLoading: tripWithFaultIsloading } = useQuery({
    queryKey: ["tripWithFaults", Month],
    queryFn: () =>
      fetchData("https://veemanage.runasp.net/api/Dashboard/Trips-With-Faults"),
  });
  const { data: tripCompleted, isLoading: tripCompletedIsloading } = useQuery({
    queryKey: ["tripCompleted", Month],
    queryFn: () =>
      fetchData(
        "https://veemanage.runasp.net/api/Dashboard/Trips-Without-Faults"
      ),
  });

  async function fetchAiChart1() {
    try {
      const response = await axios.get(
        "https://veemanage.runasp.net/api/Dashboard/priority-chart",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          responseType: "blob",
        }
      );
      console.log(response);
      const imageBlob = response?.data;
      const imageUrl = URL?.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching AI charts:", error);
    }
  }

  const { data: ChartData1 } = useQuery({
    queryKey: ["fetchAiChart1",Month],
    queryFn: fetchAiChart1,
  });

  async function fetchAiChart2() {
    try {
      const response = await axios.get(
        "https://veemanage.runasp.net/api/Dashboard/time-series-costs-chart",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          responseType: "blob",
        }
      );
      console.log(response);
      const imageBlob = response?.data;
      const imageUrl = URL?.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching AI charts:", error);
    }
  }

  const { data: ChartData2 } = useQuery({
    queryKey: ["fetchAiChart2",Month],
    queryFn: fetchAiChart2,
  });
  const urlImage=ChartData1 !==undefined && ChartData1

  console.log(urlImage);
  
  const prevUrl = useRef();

  useEffect(() => {
    if (ChartData1 && prevUrl.current) {
      URL.revokeObjectURL(prevUrl.current);
    }
    prevUrl.current = ChartData1;
  }, [ChartData1]);

  return fuelCostIsloading ||
    maintenanceCostIsloading ||
    IsVehicelsLoading ||
    tripWithFaultIsloading ||
    tripCompletedIsloading ? (
    <Loader />
  ) : (
    <div className="main">
      <div className="flex justify-between items-center">
        <select
          className="p-2 form-control mb-3 shadow-lg rounded-lg w-48 ml-auto"
          name=""
          id=""
          value={Month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option value="1">Januaray</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black text-white  rounded-xl  shadow-md w-[100%] ">
          <div className="flex flex-col gap-4 p-4">
            <span className="text-base font-semibold mb-1">
              Total Maintenance Cost
            </span>
            <span className="text-2xl mb-3 font-medium">
              {maintenanceCost.toLocaleString()} EGP{" "}
              <span style={{ fontSize: "12px" }}>Per Month</span>
            </span>
          </div>
        </div>
        <div className="bg-white text-black border border-stone-300 shadow-md  rounded-xl w-[100%]">
          <div className="flex flex-col gap-4 p-4">
            <span className="text-base font-semibold mb-1">
              Total Fuel Cost
            </span>
            <span className="text-2xl mb-3 font-medium">
              {fuelCost.toLocaleString()} EGP{" "}
              <span style={{ fontSize: "12px" }}>Per Month</span>
            </span>
          </div>
        </div>
        <div className="bg-white text-black border border-stone-300 shadow-md  rounded-xl w-[100%]">
          <div className="flex flex-col gap-4 p-4">
            <span className="text-base font-semibold mb-1">Total Trips</span>
            <span className="text-2xl mb-3 font-medium">
              {tripWithFaults + tripCompleted}
              <span style={{ fontSize: "12px" }}> Per Month</span>
            </span>
          </div>
        </div>
        <div className="bg-white text-black border border-stone-300 shadow-md  rounded-xl w-[100%]">
          <div className="flex flex-col gap-4 p-4">
            <span className="text-base font-semibold mb-1">Total Vehicles</span>
            <span className="text-2xl mb-3 font-medium">{TotalVehicles}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        
        <div className="bg-white text-black border  border-stone-300 shadow-md  rounded-xl w-[100%]">
          <div className="flex flex-col gap-4 p-4">
            <SalesLineChart />
          </div>
        </div>
        <div className="bg-white text-black border  border-stone-300 shadow-md  rounded-xl w-[100%]">
          <div className="flex flex-col gap-4 p-4">
            <FleetPieChart />
          </div>
        </div>
        <div className="bg-white text-black border border-stone-300 shadow-md rounded-xl w-full min-h-[300px] flex items-center justify-center p-4">
          {!urlImage ? (
        
            <p>Loading...</p>
          ) : (
                <img
              src={urlImage}
              alt="AI Chart 1"
              className="max-h-[370px] object-contain"
              onError={() => {
                console.log("Image failed to load", urlImage);
                // Optionally, set a fallback image or message here
              }}
            />
          )}
        </div>
        <div className="bg-white text-black border border-stone-300 shadow-md rounded-xl w-full min-h-[300px] flex items-center justify-center p-4">
          {ChartData2 ? (
            <img
              src={ChartData2}
              alt="AI Chart 2"
              className=" max-h-[370px] object-contain"
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
