import React from 'react'
import Profile from '../Profile/Profile'
import { useParams } from 'react-router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { FaCar, FaDotCircle, FaToolbox, FaTools } from 'react-icons/fa';
import MaintenanceHistory from '../Maintience/MaintenanceHistory';
import { formatDate } from 'react-calendar/dist/cjs/shared/dateFormatter';
import { AlertTriangle, Clock } from 'lucide-react';
import Loader from '../Loader/Loader';

export default function VehiclesProfile() {
   const {id}= useParams()
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

   async function getMaintenanceParts() {
    try {
      const response = await axios.get(
        `https://veemanage.runasp.net/api/MaintenanceeTracking/MaintenanceTrackings`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
                VehicleId: id,
            },
        }   );
        console.log("maintenance Parts", response);
        
        return response?.data;
    }
     catch (error) {
      console.error("Error fetching Maintenance parts:", error);
      return error;
    }  
   }
   async function getVehicleById() {
    try {
      const response = await axios.get(
        `https://veemanage.runasp.net/api/Vehicle/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }   );
        return response?.data;
    }
     catch (error) {
      console.error("Error fetching vehicles:", error);
      return error;
    }  
   }
   async function getMaintenanceHistory() {
    try {
      const response = await axios.get(
        `https://veemanage.runasp.net/api/Maintenance/Report/Final/`,{
          params:{
            VehicleId: id
          },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }   );
        console.log("maintenance history", response?.data?.data);
        return response?.data?.data;
    }
     catch (error) {
      console.error("Error fetching Maintenance history:", error);
      return error;
    }  
   }

       const {data: maintenanceParts, isLoading: MaintenancePartsLoading} = useQuery({
     queryKey: ["maintenancePartsHistory"],
     queryFn: getMaintenanceParts,
    });
       const {data:maintenanceHistory, isLoading: MaintenanceHistoryLoading} = useQuery({
     queryKey: ["getMaintenanceHistory"],
     queryFn: getMaintenanceHistory,
    });
       const {data, isLoading} = useQuery({
     queryKey: ["vehicle"],
     queryFn: getVehicleById,
    });
    data&&console.log("Vehicles data:", data);
    if(isLoading || MaintenanceHistoryLoading || MaintenancePartsLoading) return <Loader/>

  return <>
  <div className="container p-2 grid md:grid-cols-12 gap-4">
   <div className="lg:col-span-8 col-span-12">

  <div className='carInfo bg-white p-4 rounded-lg shadow-md col-span-12 lg:col-span-8 mb-4 '>
    
    <div className="title flex justify-between p-2 border-b-2 border-gray-200">
      <div className="modelName text-blue-500 font-bold text-xl flex items-center gap-3 "><FaCar size={26}/> { data?.vehicleModel?.brand?.name } { data?.vehicleModel?.name} </div>
      <div className={`status ${data?.status === "Available" ? "bg-green-500" : "bg-red-500"}  text-white p-2 rounded-2xl  font-bold`}>{data?.status=="Available"?"Available":"Under Repair"}</div>
    </div>
    <div className="details grid md:grid-cols-2 p-2">
      <div className="parentItems">

      <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Model Year</span>
        <span className='text-gray-500'>{data?.modelYear}</span>
      </div>

      <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Category</span>
        <span className='text-gray-500'>{data?.vehicleModel?.category?.name}</span>
      </div>
      <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Current Km</span>
        <span className='text-gray-500'>{data?.currentOdometerKM}</span>
      </div>
      {/* <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Fuel Efficiency</span>
        <span className='text-gray-500'>{data?.vehicleModel?.fuelEfficiency}</span>
      </div> */}
       <div className="item flex flex-col gap-2 mb-3">
                  <span className=" font-bold">Toatal Fulel Cost</span>
                  <span className="text-gray-500">{data?.toatalFuleCost}</span>
                </div>
                <div className="item flex flex-col gap-2 mb-3">
                  <span className=" font-bold">total Maintenance Cost</span>
                  <span className="text-gray-500">{data?.totalMaintenanceCost}</span>
                </div>
      </div>
      <div className="parentItems">

      <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Fuel Type</span>
        <span className='text-gray-500'>{data?.fuelType}</span>
      </div>
      <div className='item flex flex-col gap-2 mb-3'>
        <span className=' font-bold'>Plate Number</span>
        <span className='text-gray-500'>{data?.palletNumber}</span>
      </div>
      

       <div className="item flex flex-col gap-2 mb-3">
                  <span className=" font-bold">Plate Number</span>
                  <span className="text-gray-500">{data?.palletNumber}</span>
                </div>
               
                     <div className="item flex flex-col gap-2 mb-3">
                  <span className=" font-bold">Joined Year</span>
                  <span className="text-gray-500">{new Date(data?.joinedYear,).toLocaleDateString("en-GB", {
        year: "numeric",})}</span>
                </div>
                <div className="item flex flex-col gap-2 mb-3">
                  <span className=" font-bold">last Service</span>
                  <span className="text-gray-500">
                  {data?.lastMaintenanceDate
                                  ? new Date(data.lastMaintenanceDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
    </div>
      </div>
         </div>
  <div className='MaintenanceHistory bg-white p-4 rounded-lg shadow-md col-span-12  lg:col-span-8 mb-4 '>
    
    <div className="title flex justify-between p-2 border-b-2 border-gray-200 mb-5">
      <div className="modelName text-blue-500 font-bold lg:text-xl flex items-center gap-3 "><FaTools/> Maintenance History </div>
    </div>
    {maintenanceHistory?.length===0?( <div className='text-center text-blue-500 text-xl'>No Maintenance History</div>):(
    MaintenanceHistoryLoading? (<div className='text-center text-blue-500 text-xl'>Loading...</div>):(
      maintenanceHistory?.map((history, index) => (
            <div className='mb-3 border-l-2 border-gray-300 p-4' key={index}>
      <div className="head font-bold text-lg mb-2 flex items-center gap-2">
        <FaDotCircle size={20} className='text-blue-500'/>
        {history?.maintenanceCategory} Maintenance Services and Repairs {history?.changedParts?.join( ", ")}
      </div>
      <div className='description mx-7'>
        <span className='text-gray-500 mb-2'>Request Title :{history?.requestTitle}</span>
        <div className='text-gray-500'> Changed Parts : <span className='font-bold'> {history?.changedParts?.join( ", ")}</span></div>
        <div className='text-gray-500'> Total Cost : <span className='font-bold'> {history?.totalCost} LE</span></div>
        <div className='text-gray-500'> Mechanic  : <span className='font-bold'> {history?.mechanicName}</span></div>
        <div className='text-gray-500'> Completed On  : <span className='font-bold'> {formatDateTime( history?.finishedDate)}</span></div>
      </div>
    </div>
        
      ))
    )
      

        )}

   
         </div>


  </div>
  <div className='lg:col-span-4 col-span-12'>

  
    <div className='Parts  lg:col-span-4 col-span-12 rounded-lg bg-white shadow-md p-4 max-h-fit overflow-y-scroll h-[65vh]' >

      <div className="title text-xl text-blue-500 font-bold p-2  border-b-2 border-gray-100 mb-3">
        Parts Tracking
      </div>

   {!maintenanceParts?.dueParts || maintenanceParts?.dueParts?.length === 0 ? (
  <div className='text-center text-blue-500 text-xl'>No Parts</div>
) : (
  maintenanceParts?.dueParts.map((part, index) => (
    <div className='part p-2 bg-gray-50 border border-blue-200 rounded-lg mb-2 text-sm w-full' key={index}>
      <div className='flex flex-wrap'>
        <div className='flex flex-col justify-between gap-2 mb-3 w-1/2'>
          <span className='font-bold'>Part Name</span>
          <span className='font-bold text-gray-500'>{part?.partName}</span>
        </div>
        <div className='flex flex-col justify-between gap-2 mb-3 w-1/2'>
          <span className='font-bold'>Last Replaced</span>
          <span className='font-bold text-gray-500'>{part?.lastReplacedAtKm} Km</span>
        </div>
        <div className='flex flex-col justify-between gap-2 w-1/2'>
          <span className='font-bold'>Next Change Km</span>
          <span className='font-bold text-gray-500'>{part?.nextChangeKm} Km</span>
        </div>
        <div className='flex flex-col justify-between gap-2 w-1/2'>
          <span className='font-bold'>Next Change Date</span>
          <span className='font-bold text-gray-500'>{formatDateTime(part?.nextChangeDate)}</span>
        </div>
        <div className='flex flex-col justify-between gap-2 w-1/2 mt-4'>
          {part?.isDue && (
            <span className="flex items-center text-red-500 font-medium">
              <AlertTriangle className="w-10 h-6" /> Warning
            </span>
          )}
          {part?.isAlmostDue && (
            <span className="flex items-center text-yellow-500 font-medium">
              <Clock className="w-4 h-4 mr-1" /> Near to maintenance
            </span>
          )}
        </div>
      </div>
    </div>
  ))
)}



    </div>
    <div className='tripHistory lg:col-span-4 col-span-12 rounded-lg bg-white shadow-md p-4 max-h-fit overflow-y-scroll h-[65vh]  mt-4' >

      <div className="title text-xl text-blue-500 font-bold p-2  border-b-2 border-gray-100 mb-3">
        Trips History
      </div>

      {data?.tripRequests?.length===0?( <div className='text-center text-blue-500 text-xl'>No Trips</div>):(
        
      
      data?.tripRequests?.map((trip,index) => (
        <div className='trip p-2 bg-blue-50 border border-blue-200  rounded-lg mb-2 text-sm' key={index}>
          <div className='flex justify-between gap-2 mb-1'><span className='font-bold'>from :</span> <span className=''>{trip?.pickupLocation}</span></div>
          <div className='flex justify-between gap-2 mb-1'><span className='font-bold'>to :</span> <span className=''>{trip?.destination}</span></div>
          <div className='flex justify-between gap-2 mb-1'><span className='font-bold'>Details :</span> <span className=''>{trip?.details}</span></div>
          <div className='flex justify-between gap-2 mb-1'><span className='font-bold'>Trip Type :</span> <span className=''>{trip?.tripType}</span></div>
          <div className='flex justify-between gap-2 mb-1'><span className='font-bold'>Date :</span> <span className=''>{ formatDateTime(trip?.date)}</span></div>
          {trip?.isDaily&&
          <div className='flex justify-between gap-2 mb-1 text-blue-700 font-bold'>Daily Trip</div>}
          
        </div>
      )))}
    

    </div>
    </div>
  

  </div>
  </>
   
}
