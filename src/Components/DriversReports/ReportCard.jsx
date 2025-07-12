import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaAdjust, FaCircle, FaSearch, FaTools } from "react-icons/fa";

const ReportCard = ({
  data,
  isLoading,
  formatDateTime,
  markAsSeenMutation,
  sendToMechanicMutation,
  setFaultReportId,
}) => {
  const [openCardId, setOpenCardId] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [shownActions, setShownActions] = useState({});

  async function fetchMechanics() {
    try {
      const response = await axios.get(
        "https://veemanage.runasp.net/api/User/all/mechanic",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      return [];
    }
  }

  const { data: mechanics = [] } = useQuery({
    queryKey: ["mechanics"],
    queryFn: fetchMechanics,
  });

  return (
    <>
      {data
        ?.filter(
          (item) => item.seen === false || item.sentToMechanics === false
        )
        .map((item, index) => {
          const reportDetails = [
            { title: "Driver Name", value: item?.driver?.displayName || "N/A" },
            {
              title: "Plate Number",
              value: item?.vehicle?.palletNumber || "N/A",
            },
            { title: "Issue Type", value: item?.faultType || "N/A" },
            { title: "Problem", value: item?.faultDetails || "N/A" },
            { title: "Status", value: item?.status || "N/A" },
            { title: "Fuel Cost", value: `${item?.fuelCost || item.cost || 0} EGP` },
            { title: "Location", value: item?.faultAddress || "N/A" },
          ];

          const isCardOpen = openCardId === item.id;
          const actionsVisible = shownActions[item.id] !== false;

          return (
            <div
              key={index}
              className="rounded-2xl border shadow-lg overflow-hidden bg-white transition duration-300 hover:shadow-xl mb-5 max-h-fit"
            >
              {/* Header */}
              <div
                className={`p-2 flex justify-between items-center ${
                  item.seen
                    ? "bg-gray-400"
                    : item.reportType === "Fault"
                    ? "bg-red-500"
                    : "bg-green-500"
                } text-white`}
              >
                <div className="flex items-center gap-2">
                  {item.reportType === "Fault" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span className="font-semibold text-lg">
                    {item.reportType === "Fault"
                      ? "Fault Report"
                      : "Trip Completed"}
                  </span>
                </div>
                <span className="text-sm">
                  {formatDateTime(item?.reportedAt)}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                {reportDetails.map((detail, i) => (
                  <div key={i}>
                    <div className="text-gray-500 text-sm">{detail.title}</div>
                    <div className="font-semibold text-gray-800">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Detection Section */}
              {item?.faultType && item?.reportType === "Fault" && (
                <div className="relative my-5 mx-5 p-4 border-l-[6px] rounded-xl shadow-md border-blue-500 bg-gradient-to-br from-blue-50 to-white">
                  <div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    AI DETECTION
                  </div>
                  <div className="mt-3 text-base text-blue-900 font-bold flex items-center gap-2">
                    <FaTools size={20} /> Issue Detected:
                    <span className="text-black">{item.faultType}</span>
                  </div>
                  <div className="text-sm mt-5 flex items-center gap-2">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FaCircle size={20} className="text-red-300" /> Emergency
                      Level:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold ${
                        item.priority === "High"
                          ? "bg-red-600"
                          : item.priority === "Medium"
                          ? "bg-orange-500"
                          : "bg-green-600"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {actionsVisible && (
                <div className="flex justify-end items-center gap-3 p-4 border-t">
                  {item.seen === false && (
                    <button
                      onClick={() => {
                        const url = `https://veemanage.runasp.net/api/Trip/Report/Fault/Report/Fault/${item.id}/mark-as-seen`;
                        markAsSeenMutation(url);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Mark as Seen
                    </button>
                  )}
                  {item.reportType === "Fault" && (
                    <button
                      onClick={() => {
                        setOpenCardId(item.id);
                        setVehicleId(item?.vehicle?.id);
                        setFaultReportId(item.id);
                        setShownActions((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Send to Mechanic
                    </button>
                  )}
                </div>
              )}

              {/* Mechanic Form */}
              {isCardOpen && (
                <div className="bg-gray-50 p-5 border-t space-y-4">
                  <textarea
                    className="w-full border rounded-md p-2"
                    placeholder="Describe the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <select
                    value={selectedMechanic}
                    onChange={(e) => setSelectedMechanic(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
                  >
                    <option value="">Select Mechanic</option>
                    {mechanics.map((mech) => (
                      <option key={mech.id} value={mech.id}>
                        {mech.displayName}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        sendToMechanicMutation({
                          mechanicId: selectedMechanic,
                          vehicleId,
                          description,
                        });

                        const url = `https://veemanage.runasp.net/api/Trip/Report/Fault/Report/Fault/${item.id}/mark-as-seen`;
                        markAsSeenMutation(url);

                        setOpenCardId(null);
                        setSelectedMechanic("");
                        setDescription("");
                        setVehicleId("");
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setOpenCardId(null);
                        setSelectedMechanic("");
                        setDescription("");
                        setVehicleId("");
                        setShownActions((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }));
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>

                  {item?.seen === true && (
                    <p className="my-2 text-gray-500"> Report has been seen</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default ReportCard;
