import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { functionsIn } from "lodash";
import React from "react";
import { useParams } from "react-router";
import TrackingMap from "./Maps";

export default function TripDetails() {
  const { id } = useParams();

  async function getTripDetails() {
    try {
      const res = await axios.get(
        `https://veemanage.runasp.net/api/TripRequest/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Trip Details:", res.data);
      return res?.data || {};
    } catch (err) {
      console.error("Error fetching trip details:", err);
      throw err;
    }
  }
  async function tripLocation() {
    try {
      const res = await axios.get(
        `https://veemanage.runasp.net/api/TripLocation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      return res || [];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  const { data: tripLocationData, isLoading: LocationIsloading } = useQuery({
    queryFn: tripLocation,
    queryKey: ["triplocation"],
    enabled: !!id,
    refetchInterval:1000

  });
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["tripDetails", id],
    queryFn: getTripDetails,
  });

  // Array of title-data pairs for rendering
  const tripDetails = [
    {
      title: "Vehicle Name",
      value:`${data?.tripRequest?.vehicle?.vehicleModelDto?.brand}    ${data?.tripRequest?.vehicle?.vehicleModelDto?.name} `,
    },
    {
      title: "Driver Name",
      value: data?.tripRequest?.driver?.displayName || "N/A",
    },
    { title: "Destination", value: data?.tripRequest?.destination || "N/A" },
    { title: "Status", value: data?.tripRequest?.status || "N/A" },
    {
      title: "Start Time",
      value: formatDateTime(data?.tripRequest?.date) || "N/A",
    },
    { title: "Date", value: formatDateTime(data?.tripRequest?.date) || "N/A" },
    {
      title: "Vehicle Category",
      value:
        data?.tripRequest?.vehicle?.vehicleModelDto?.category?.name || "N/A",
    },
    {
      title: "License Plate",
      value: data?.tripRequest?.vehicle?.palletNumber || "N/A",
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-4 text-stone-700">
        Loading trip details...
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-7 w-full py-2 bg-stone-200 text-stone-700 border border-stone-300 rounded-md shadow-sm font-semibold text-xl">
        Trip Tracking
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-2 px-5 rounded-lg shadow-lg border border-stone-300 gap-4 mb-5 ">
        {tripDetails.map((detail, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 justify-center items-start mb-4"
          >
            <span className="title font-semibold text-lg">{detail.title}</span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
     
        <div className="h-[100%] w-fullrounded-lg">
          <TrackingMap id={id} />
        </div>
    </>
  );
}
