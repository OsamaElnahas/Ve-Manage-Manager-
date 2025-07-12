import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Popup from "../PopUp/PopUp";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";

const AssignTrip = () => {
  // Updated Yup schema to include isDaily as a boolean
  const schema = Yup.object().shape({
    driverId: Yup.string().required("Driver ID is required"),
    vehicleId: Yup.string().required("Vehicle ID is required"),
    tripType: Yup.number()
      .required("Trip type is required")
      .oneOf([0, 1], "Trip type must be 0 or 1"),
    date: Yup.string(),
    details: Yup.string().required("Details are required"),
    pickupLocation: Yup.string().required("Pickup location is required"),
    destination: Yup.string().required("Destination is required"),
    isDaily: Yup.boolean().default(false), // Optional boolean field
  });

  const defaultValues = {
    driverId: "",
    vehicleId: "",
    tripType: "",
    date: "",
    details: "",
    pickupLocation: "",
    destination: "",
    isDaily: false, // Default value for isDaily
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function getDrivers() {
    try {
      const res = await axios.get("https://veemanage.runasp.net/api/User/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          Role: "driver",
          TripDate: finalDate,
          filter: "FreeDrivers",
        },
      });
      return res?.data;
    } catch (err) {
      console.error("Failed to fetch drivers:", err.message);
      throw err;
    }
  }

  const { data: driversData, isLoading: isDriverDataLoading } = useQuery({
    queryFn: getDrivers,
    queryKey: ["driverData", finalDate],
  });

  async function getVehicles() {
    try {
      const res = await axios.get("https://veemanage.runasp.net/api/Vehicle/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          CategoryId: categoryId,
          TripDate: finalDate,
          AvailableForTrip: true,
        },
      });
      return res?.data;
    } catch (err) {
      console.error("Failed to fetch vehicles:", err.message);
      throw err;
    }
  }

  async function getCategory() {
    try {
      const res = await axios.get(
        "https://veemanage.runasp.net/api/Vehicle/Category",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res?.data;
    } catch (err) {
      console.error("Failed to fetch categories:", err.message);
      throw err;
    }
  }

  const { data: vehiclesData, isLoading: isVehiclesDataLoading } = useQuery({
    queryFn: getVehicles,
    queryKey: ["vehiclesData", categoryId, finalDate],
  });

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryFn: getCategory,
    queryKey: ["categoryData"],
  });

  async function onSubmit(data) {
    setIsLoading(true);
    console.log("Data to be sent:", data); // Includes isDaily: true/false

    try {
      const res = await axios.post(
        "https://veemanage.runasp.net/api/TripRequest/",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Trip is Sent");
      setIsPopupOpen(true);
      console.log(res?.data);
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setIsLoading(false);
  }

  return (
    <div className="main">
      <div className="head text-center">
        <span className="font-bold text-2xl">Assign Trip to Driver</span>
      </div>
      <ToastContainer />

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ml-6">
          {/* Trip Date */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Trip Date
            </span>
            <input
              type="datetime-local"
              {...register("date")}
              name="date"
              className="border border-stone-400 rounded-md px-3 py-2 h-[50px] w-[100%] focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => {
                setTempDate(e.target.value);
                setValue("date", e.target.value);
              }}
              onBlur={() => {
                setFinalDate(tempDate);
              }}
            />
            {errors.date && (
              <span className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Category
            </span>
            <div className="relative w-[100%]">
              <select
  className="appearance-none border border-stone-400 rounded-md px-3 py-2 h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
  disabled={isCategoryLoading}
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
>
  <option value="" disabled>
    {isCategoryLoading ? "Loading Categories..." : "Select Category..."}
  </option>
  {categoryData?.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>

              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-8 text-blue-600" />
            </div>
          </div>

          {/* Driver ID */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Driver
            </span>
            <div className="relative w-[100%]">
              <select
                {...register("driverId")}
                className="appearance-none border border-stone-400 rounded-md px-3 py-2 h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={finalDate === "" || isDriverDataLoading}
              >
                <option value="" disabled>
                  {isDriverDataLoading
                    ? "Loading drivers..."
                    : "Select driver..."}
                </option>
                {driversData?.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-8 text-blue-600" />
              {errors.driverId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.driverId.message}
                </span>
              )}
            </div>
          </div>

          {/* Vehicle ID */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Vehicle
            </span>
            <div className="relative w-[100%]">
              <select
                {...register("vehicleId")}
                className="appearance-none border border-stone-400 rounded-md px-3 py-2 h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={
                  (finalDate === "" && categoryId === "") ||
                  isVehiclesDataLoading
                }
              >
                <option value="" disabled>
                  {isVehiclesDataLoading
                    ? "Loading vehicles..."
                    : "Select vehicle..."}
                </option>
                {vehiclesData?.map(
                  (vehicle) =>
                    vehicle.status === "Available" && (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    )
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-8 text-blue-600" />
              {errors.vehicleId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.vehicleId.message}
                </span>
              )}
            </div>
          </div>

          {/* Trip Type */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Trip Type
            </span>
            <div className="relative w-[100%]">
              <select
                {...register("tripType")}
                className="appearance-none border border-stone-400 rounded-md px-3 py-2 h-[50px] w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" disabled>
                  Select trip type...
                </option>
                <option value={0}>Business</option>
                <option value={1}>Personal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-8 text-blue-600" />
              {errors.tripType && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.tripType.message}
                </span>
              )}
            </div>
          </div>

          {/* Pickup Location */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Pickup Location
            </span>
            <input
              type="text"
              placeholder="Enter pickup location..."
              {...register("pickupLocation")}
              className="border border-stone-400 rounded-md px-3 py-2 h-[50px] w-[100%] focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.pickupLocation && (
              <span className="text-red-500 text-sm mt-1">
                {errors.pickupLocation.message}
              </span>
            )}
          </div>

          {/* isDaily Checkbox */}

          {/* Destination */}
          <div className="flex flex-col items-start p-4 ml-6">
            <span className="mb-2 text-lg font-medium font-Nunito text-[#666666]">
              Destination
            </span>
            <input
              type="text"
              placeholder="Enter destination..."
              {...register("destination")}
              className="border border-stone-400 rounded-md px-3 py-2 h-[50px] w-[100%] focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.destination && (
              <span className="text-red-500 text-sm mt-1">
                {errors.destination.message}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="col-span-2 flex flex-col items-start p-4 ml-6">
            <span className="text-lg font-medium font-Nunito text-[#666666]">
              Details
            </span>
            <textarea
              placeholder="Additional info..."
              {...register("details")}
              className="border border-stone-400 rounded-md px-3 py-2 w-[90%] h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.details && (
              <span className="text-red-500 text-sm mt-1">
                {errors.details.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center p-4 ml-12 ">
          <label className="flex items-center space-x-2 bg-white w-[30%] p-4 rounded-lg border border-blue-500 ">
            <input
              type="checkbox"
              {...register("isDaily")}
              className="h-5 w-5 text-blue-600 border-stone-400 rounded focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-lg font-medium font-Nunito text-[#666666]">
              Daily Trip
            </span>
          </label>
          {errors.isDaily && (
            <span className="text-red-500 text-sm mt-1">
              {errors.isDaily.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center p-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-blue-400"
          >
            {isLoading ? "Submitting..." : "Assign Trip"}
          </button>
        </div>
      </form>
      {isPopupOpen && (
        <Popup
          status={true}
          link={"/trips"}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default AssignTrip;
