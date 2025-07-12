import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

const Model = () => {
  async function getModels() {
    try {
      const res = await axios.get(
        "https://veemanage.runasp.net/api/Vehicle/Model",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching models:", error);
      return error;
    }
  }

  const { data: ModelsData, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="font-Nunito">
  

      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ModelsData.map((item, index) => {
          return (
            <div
              key={index}
              className="item bg-[#FFFFFF]  p-2 rounded-lg shadow-lg m-2 border-l-[5px] min-h-[213px] border-[#4880FF] "
            >
              <div className="flex justify-between items-center border-b-2 pb-4 mb-5">
                <span className="font-semibold text-xl">
                  {item?.brand} {item?.name}
                </span>
                
              </div>
              <span className="block mb-4">
                Category:{" "}
                <span className="text-[#6C757D]">{item?.category?.name}</span>
              </span>
              <span className="block">
                Description:{" "}
                <span className="text-[#6C757D] text-sm">
                  {item?.category?.description}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Model;
