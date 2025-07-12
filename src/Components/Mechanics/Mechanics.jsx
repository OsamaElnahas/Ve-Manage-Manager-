import React from "react";
import { Link } from "react-router-dom";
import AllUsersTable from "../AllUsersTable/AllUsersTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import FetchWrapper from "../FetchWrapper";

export default function Mechans() {

  const {isLoading ,data,isError,error}= useQuery({
    queryKey: ["mechanics"],
    queryFn: getDataOfUsers,
  });
  async function getDataOfUsers() {
    try {
      const res = await axios.get("https://veemanage.runasp.net/api/User/all/mechanic", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("mechanic data", res?.data);
      return res?.data;
    } catch (error) {
      // console.error("Error fetching users:", error);
      return [];
    }
  }

  return <>
  <div className="text-center mb-7 w-[100%] py-[0.5rem]  bg-stone-200 text-stone-700 border border-stone-300   rounded-md shadow-sm font-semibold text-xl">
        Mechanics
    </div>
     
  <FetchWrapper isLoading={isLoading} isError={isError} error={error} data={data}>
      <AllUsersTable
                  keyOfQuery={"mechanics"}

        baseUrl="https://veemanage.runasp.net/api/User"

      titles={[
        "ID",
        "Name",
    "Phone",
    "Email",
    "Date of Birth",
    "National ID",
  ]}       rows={data?.map((item, index) => ({
        link: `/mechanicProfile/${ item.id}`,
        id:item.id,
        values: [
          index + 1,
          item.firstName +" "+item.lastName,
          item.phoneNumber,
          item.email,
          item.dateOfBirth,
          item.nationalId,
        ],
      }))}
      columnSizes={["8%", "16%", "20%", "20%", "15%", "18%", "3%"]}
                      
                      />
  </FetchWrapper>
    </>
  
}