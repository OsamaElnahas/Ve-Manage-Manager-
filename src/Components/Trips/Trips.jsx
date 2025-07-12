import React from "react";
import AllUsersTable from "../AllUsersTable/AllUsersTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import FetchWrapper from "../FetchWrapper";
import { Link, NavLink } from "react-router";

const Trips = () => {
  async function getTips() {
    try {
      const response = await axios.get(
        "https://veemanage.runasp.net/api/TripRequest/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Trips data:", response?.data);
      return response?.data?.tripRequests || [];
    } catch (error) {
      console.error("Error fetching trips:", error);
      return [];
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: getTips,
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

  return (
    <div>
      <div className="text-center mb-7 w-full py-2 bg-stone-200 text-stone-700 border border-stone-300 rounded-md shadow-sm font-semibold text-xl">
        Trips
      </div>
       <NavLink
        to={"/trips/add"}
        className="block  border border-primaryColor w-[180px] p-2 text-center rounded-lg text-primaryColor font-bold"
        >
        + Assign Trip
      </NavLink>
      <FetchWrapper isLoading={isLoading} data={data}>
        <AllUsersTable
          titles={[
            "#",
            "Driver Name",
            "Vehicle Type",
            "Plate Number",
            "Trip Status",
            "Destination",
            "Date & Time",
            " ",
          ]}
          rows={data?.map((item, index) => ({
            link: `/trips/${item.id}`,
            id: item.id,
            values: [
              index + 1,
              item.driver.displayName,
              item.vehicle?.vehicleModelDto?.category.name,
              item.vehicle.palletNumber,
              item.status,
              item.destination,
              formatDateTime(item.date),
            ],
          }))}
          columnSizes={[
            "5%", // #
            "15%", // Driver Name
            "12%", // Vehicle Type
            "15%", // Plate Number
            "15%", // Trip Status
            "17%", // Destination
            "17%", // Date & Time
            "5%", // Action
          ]}
        />
      </FetchWrapper>
    </div>
  );
};

export default Trips;
