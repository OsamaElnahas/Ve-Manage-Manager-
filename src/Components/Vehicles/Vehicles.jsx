import React from "react";
import { Link } from "react-router";
import AllUsersTable from "../AllUsersTable/AllUsersTable";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import FetchWrapper from "../FetchWrapper";

export default function Vehicles() {
   const[PageSize,setPageSize]=useState(12)
  const[PageIndex,setPageIndex]=useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", PageSize, PageIndex],
    queryFn: getVehicles,
  });
data 
  async function getVehicles() {
    try {
      const response = await axios.get(
        "https://veemanage.runasp.net/api/Vehicle",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
           params: {
          PageSize: PageSize,
          PageIndex: PageIndex,
        },
        }
      );
      return response?.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
  }
  data && console.log("Vehicles data:", data);
  return (
    <>
      <div className="text-center mb-7 w-[100%] py-[0.5rem]   bg-stone-200 text-stone-700 border border-stone-300   rounded-md shadow-sm font-semibold text-xl">
        Vehicles
      </div>
      <div className="controls">
        <div className="btns flex gap-5  mb-8">
          <Link
            to={"/vehicles/categories"}
            className="block  border bg-primaryColor text-white w-[180px] p-2 text-center rounded-lg font-bold"
          >
            Categories
          </Link>
          <Link
            to={"/vehicles/model"}
            className="block  border bg-primaryColor text-white w-[180px] p-2 text-center rounded-lg font-bold"
          >
            Models
          </Link>
        </div>
      </div>

      <div>
          {/* {data ? data.length === 0 && (
            <div className="text-center text-black">
              No vehicles found.
            </div>
          ) : ( */}
        <FetchWrapper isLoading={isLoading} data={data}>
          <AllUsersTable
            keyOfQuery={"vehicles"}
            baseUrl="https://veemanage.runasp.net/api/Vehicle/"
            titles={["ID", "Model", "Palet Number", "Joind Year", "Category"]}
            rows={data?.map((item, index) => ({
              link: `/vehicles/VehiclesProfile/${item.id}`,
              id: item.id,
              values: [
                index + 1,
                item.name,
                item.palletNumber,
                item.joinedYear,
                item.category,
              ],
            }))}
            columnSizes={["10%", "28%", "20%", "20%", "19%", "3%"]}
          />
        </FetchWrapper>
          {/* )} */}
         
          
      </div>
       {data?.length>0 &&
          
         <div className="pagination  flex justify-center gap-10 items-center mt-5 mb-5">
        <button className="bg-primaryColor text-white p-2 rounded-md w-[140px] cursor-pointer hover:bg-blue-800" onClick={() => setPageIndex(PageIndex - 1)} disabled={PageIndex === 1}>Previous</button>
        <span>{PageIndex}</span>
        <button className="bg-primaryColor text-white p-2 rounded-md w-[140px] cursor-pointer hover:bg-blue-800" onClick={() => setPageIndex(PageIndex + 1)} disabled={data?.length < PageSize}>Next</button>
      </div>
}
    </>
  );
}
