import React, { useState } from "react";
import {
  FaArrowRight,
  FaInfo,
  FaInfoCircle,
  FaRecycle,
  FaRemoveFormat,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link, NavLink } from "react-router";
import Popup from "../PopUp/PopUp";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function AllUsersTable({
  titles,
  rows,
  columnSizes,
  baseUrl,
  keyOfQuery,
}) {
  const queryClient = useQueryClient();
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleToggle = (index) => {
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
    } else {
      setSelectedRowIndex(index);
    }
  };

  // Function to get the appropriate color class based on trip status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-gray-500";
      default:
        return "bg-blue-500"; // Fallback color
    }
  };

  return (
    <div className="font-Inter font-[540] w-full p-1 md:p-3 text-[0.75rem] md:text-[0.9rem] lg:text-[1.1rem] flex flex-col gap-3">
      <div className="hidden lg:flex flex-col gap-y-2 w-full">
        {/* Table header */}
        <div
          className={`grid text-center text-[#04103B] font-[550]`}
          style={{ gridTemplateColumns: columnSizes.join(" ") }}
        >
          {titles?.map((title) => (
            <div className="flex items-start p-2" key={title}>
              {title}
            </div>
          ))}
          <div className="p-2"></div>
        </div>

        {rows?.map((row, index) => (
          <div
            className={`grid text-center mb-2 bg-white rounded-xl font-[300] shadow-sm relative transition duration-500 border-0 ${
              selectedRowIndex === index
                ? "shadow-lg border-2 border-primaryColor"
                : "border border-stone-300"
            }`}
            key={index}
            style={{ gridTemplateColumns: columnSizes.join(" ") }}
          >
            {row?.values?.map((item, idx) => (
              <div
                className="px-3 py-2 truncate flex items-center justify-start gap-2"
                key={idx}
              >
                {titles[idx] === "Trip Status" && (
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${getStatusColor(
                      item
                    )}`}
                  ></span>
                )}
                {item}
              </div>
            ))}
            <div className="flex flex-col justify-center items-center text-primaryColor font-bold cursor-pointer">
              <IoEllipsisVertical
                size={25}
                onClick={() => handleToggle(index)}
              />
            </div>

            {selectedRowIndex === index && (
              <div className="flex flex-col gap-1 p-2 rounded-md shadow-2xl text-primaryColor border border-primaryColor absolute right-0 -top-[38px] bg-white z-50 transition duration-500">
                <NavLink
                  to={row.link}
                  className="p-[3px] px-1  border-stone-300 text-[16px] cursor-pointer flex gap-2 items-center transition duration-300 rounded-md hover:bg-primaryColor hover:text-white"
                >
                  <span>
                    <FaInfoCircle />
                  </span>{" "}
                  Details
                </NavLink>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Responsive layout for small screens */}
      <div className="flex flex-col gap-4 lg:hidden">
        {rows?.map((row, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow border text-sm"
          >
            {titles?.map((title, index) => (
              <div key={index} className="flex justify-between border-b py-1">
                <span className="font-semibold text-gray-600">{title}</span>
                <span className="text-gray-800 flex items-center gap-2">
                  {title === "Trip Status" && (
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${getStatusColor(
                        row.values[index]
                      )}`}
                    ></span>
                  )}
                  {row.values[index]}
                </span>
              </div>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to={row.link}
                className="inline-block bg-primaryColor text-white py-1 px-3 rounded-lg text-sm w-28 text-center"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
