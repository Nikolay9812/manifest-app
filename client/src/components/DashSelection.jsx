import React, { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsBuildingsFill } from "react-icons/bs";
import { FaMapMarkedAlt, FaShuttleVan } from "react-icons/fa";
import { LiaTrashAltSolid } from "react-icons/lia";

export default function DashSelection() {
  const { currentUser } = useSelector((state) => state.user);
  const [stantions, setStantions] = useState([]);
  const [plate, setPlate] = useState("");
  const [tuvStartDate, setTuvStartDate] = useState("");
  const [tuvExpiryDate, setTuvExpiryDate] = useState("");
  const [tor, setTor] = useState("");
  const [stantion, setStantion] = useState("");
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [showModalStantion, setShowModalStantion] = useState(false);
  const [showModalPlate, setShowModalPlate] = useState(false);
  const [showModalTor, setShowModalTor] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const [showMorePlates, setShowMorePlates] = useState(true);
  const [showMoreTors, setShowMoreTors] = useState(true);
  const [showMoreStantions, setShowMoreStantions] = useState(true);

  useEffect(() => {
    const fetchStantions = async () => {
      try {
        const res = await fetch(`/api/stantion/getstantions`);
        const data = await res.json();
        if (res.ok) {
          setStantions(data);
          if (data.length < 9) {
            setShowMoreStantions(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPlates = async () => {
      try {
        const res = await fetch(`/api/plate/getplates`);
        const data = await res.json();
        if (res.ok) {
          setPlates(data);
          if (data.length < 9) {
            setShowMorePlates(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchTors = async () => {
      try {
        const res = await fetch(`/api/tor/gettors`);
        const data = await res.json();
        if (res.ok) {
          setTors(data);
          if (data.length < 9) {
            setShowMoreTors(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchStantions();
      fetchPlates();
      fetchTors();
    }
  }, [currentUser._id]);

  const handleSubmitStantion = async (e) => {
    e.preventDefault();
    try {
      // Perform the necessary validation or data processing here before submission

      const res = await fetch("/api/stantion/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: stantion }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Stantion created successfully, update the stantions state
        setStantions([...stantions, data]); // Assuming the response contains the created stantion object
        setShowModalStantion(false);
        setPublishError("");
        setStantion("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitTor = async (e) => {
    e.preventDefault();
    try {
      // Perform the necessary validation or data processing here before submission

      const res = await fetch("/api/tor/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tor }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Tor created successfully, update the tors state
        setTors([...tors, data]); // Assuming the response contains the created tor object
        setShowModalTor(false);
        setPublishError("");
        setTor("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitPlate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/plate/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: plate,
          tuvStartDate: tuvStartDate,
          tuvExpiryDate: tuvExpiryDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // Plate created successfully, update the plates state
        setPlates([...plates, data]); // Assuming the response contains the created plate object
        setShowModalPlate(false);
        setPlate(""); // Clear the plate name input field
        setTuvStartDate("");
        setTuvExpiryDate("");
        setPublishError("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePlate = async (plateId) => {
    try {
      const res = await fetch(`/api/plate/delete/${plateId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        // Update the plates state
        setPlates((prevPlates) =>
          prevPlates.filter((plate) => plate._id !== plateId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteTor = async (torId) => {
    try {
      const res = await fetch(`/api/tor/delete/${torId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        // Update the tors state
        setTors((prevTors) => prevTors.filter((tor) => tor._id !== torId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteStation = async (stationId) => {
    try {
      const res = await fetch(`/api/stantion/delete/${stationId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        // Update the stantions state
        setStantions((prevStantions) =>
          prevStantions.filter((stantion) => stantion._id !== stationId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowMoreItems = async (type) => {
    let setShowMoreFunction;
    let apiEndpoint;
    let arrayToUpdate;

    switch (type) {
      case "plates":
        setShowMoreFunction = setShowMorePlates;
        apiEndpoint = "/api/plate/getplates";
        arrayToUpdate = plates;
        break;
      case "tors":
        setShowMoreFunction = setShowMoreTors;
        apiEndpoint = "/api/tor/gettors";
        arrayToUpdate = tors;
        break;
      case "stantions":
        setShowMoreFunction = setShowMoreStantions;
        apiEndpoint = "/api/stantion/getstantions";
        arrayToUpdate = stantions;
        break;
      default:
        return;
    }

    const startIndex = arrayToUpdate.length;
    try {
      const res = await fetch(`${apiEndpoint}?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        switch (type) {
          case "plates":
            setPlates((prev) => [...prev, ...data]);
            if (data.length < 9) {
              setShowMoreFunction(false);
            }
            break;
          case "tors":
            setTors((prev) => [...prev, ...data]);
            if (data.length < 9) {
              setShowMoreFunction(false);
            }
            break;
          case "stantions":
            setStantions((prev) => [...prev, ...data]);
            if (data.length < 9) {
              setShowMoreFunction(false);
            }
            break;
          default:
            return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDuration = (startDate, expiryDate) => {
    const start = new Date(startDate);
    const expiration = new Date(expiryDate);

    // Calculate the difference in milliseconds
    const diffTime = expiration - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let durationString = '';

    // If the expiration date is in the future
    if (expiration > start) {
        // If there are more than 30 days remaining, calculate in terms of months and years
        if (diffDays >= 30) {
            // Calculate the difference in years and months
            const diffYears = expiration.getFullYear() - start.getFullYear();
            const diffMonths = expiration.getMonth() - start.getMonth();

            // Calculate the total months remaining
            let totalMonthsRemaining = diffYears * 12 + diffMonths;

            // If there are more than 12 months remaining, adjust the years and months
            if (totalMonthsRemaining >= 12) {
                const years = Math.floor(totalMonthsRemaining / 12);
                const months = totalMonthsRemaining % 12;

                durationString += years + (years === 1 ? ' year ' : ' years ');
                if (months > 0) {
                    durationString += months + (months === 1 ? ' month ' : ' months ');
                }
            } else {
                durationString += totalMonthsRemaining + (totalMonthsRemaining === 1 ? ' month ' : ' months ');
            }
        } else {
            // If there are less than 30 days remaining, show the remaining days
            durationString += diffDays + (diffDays === 1 ? ' day ' : ' days ');
        }
    } else {
        // If the expiration date is in the past or startDate, return 'expired'
        durationString = 'expired';
    }

    return durationString.trim();
};



  const calculateDurationColor = (startDate,expiryDate) => {
    const start = new Date(startDate);
    const expiration = new Date(expiryDate);
    const oneMonthBeforeExpiration = new Date(expiration);
    oneMonthBeforeExpiration.setMonth(expiration.getMonth() - 2);

    if (start >= oneMonthBeforeExpiration) {
      return "text-red-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Vehicle</h3>
              <p className="text-2xl">{plates.length}</p>
            </div>
            <FaShuttleVan className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {0}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Tor's</h3>
              <p className="text-2xl">{tors.length}</p>
            </div>
            <FaMapMarkedAlt className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {0}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Stantions
              </h3>
              <p className="text-2xl">{stantions.length}</p>
            </div>
            <BsBuildingsFill className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {0}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent vehicle</h1>
            <Button
              onClick={() => setShowModalPlate(true)}
              outline
              gradientDuoTone="greenToBlue"
            >
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Vehicle</Table.HeadCell>
              <Table.HeadCell>Tuv Start Date</Table.HeadCell>
              <Table.HeadCell>Tuv Expiry Date</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Tuv Duration</Table.HeadCell>
            </Table.Head>
            {plates &&
              plates.map((plate) => (
                <Table.Body key={plate._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(plate.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{plate.name}</Table.Cell>
                    <Table.Cell>
                      {new Date(plate.tuvStartDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(plate.tuvExpiryDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell
                      className={calculateDurationColor(plate.tuvStartDate,plate.tuvExpiryDate)}
                    >
                      {calculateDuration(plate.tuvStartDate,plate.tuvExpiryDate)}
                    </Table.Cell>
                    <Table.Cell>
                      <LiaTrashAltSolid
                        className="cursor-pointer"
                        onClick={() => handleDeletePlate(plate._id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {showMorePlates && (
            <button
              onClick={() => handleShowMoreItems("plates")}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more plates
            </button>
          )}
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent stantions</h1>
            <Button
              outline
              gradientDuoTone="greenToBlue"
              onClick={() => setShowModalStantion(true)}
            >
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Stantion</Table.HeadCell>
            </Table.Head>
            {stantions &&
              stantions.map((stantion) => (
                <Table.Body key={stantion._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(stantion.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{stantion.name}</Table.Cell>
                    <Table.Cell>
                      <LiaTrashAltSolid
                        className="cursor-pointer"
                        onClick={() => handleDeleteStation(stantion._id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>

          {showMoreStantions && (
            <button
              onClick={() => handleShowMoreItems("stantions")}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more stantions
            </button>
          )}
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent tor's</h1>
            <Button
              outline
              gradientDuoTone="greenToBlue"
              onClick={() => setShowModalTor(true)}
            >
              Add
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Tor</Table.HeadCell>
            </Table.Head>
            {tors &&
              tors.map((tor) => (
                <Table.Body key={tor._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(tor.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{tor.name}</Table.Cell>
                    <Table.Cell>
                      <LiaTrashAltSolid
                        className="cursor-pointer"
                        onClick={() => handleDeleteTor(tor._id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {showMoreTors && (
            <button
              onClick={() => handleShowMoreItems("tors")}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more tors
            </button>
          )}
        </div>
      </div>
      <Modal
        show={showModalTor}
        onClose={() => setShowModalTor(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaMapMarkedAlt className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:tet-gray-400">
              You want to add new tor?
            </h3>
            <input
              type="text"
              value={tor}
              onChange={(e) => setTor(e.target.value)}
              placeholder="Enter Plate Name"
            />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color="succes" onClick={handleSubmitTor}>
                Add Tor
              </Button>
              <Button color="gray" onClick={() => setShowModalTor(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModalPlate}
        onClose={() => setShowModalPlate(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaShuttleVan className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Add new vehicle
            </h3>
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Enter Plate Name"
            />
            <input
              type="date"
              value={tuvStartDate}
              onChange={(e) => setTuvStartDate(e.target.value)}
              placeholder="TUV Start Date"
            />
            <input
              type="date"
              value={tuvExpiryDate}
              onChange={(e) => setTuvExpiryDate(e.target.value)}
              placeholder="TUV Expiry Date"
            />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color="success" onClick={handleSubmitPlate}>
                Add Plate
              </Button>
              <Button color="gray" onClick={() => setShowModalPlate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModalStantion}
        onClose={() => setShowModalStantion(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BsBuildingsFill className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:tet-gray-400">
              You want to add new stantion?
            </h3>
            <input
              type="text"
              value={stantion}
              onChange={(e) => setStantion(e.target.value)}
              placeholder="Enter Stantion Name"
            />
            {publishError && <p className="text-red-500">{publishError}</p>}
            <div className="flex justify-center gap-4 mt-3">
              <Button color="succes" onClick={handleSubmitStantion}>
                Add Stantion
              </Button>
              <Button color="gray" onClick={() => setShowModalStantion(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
