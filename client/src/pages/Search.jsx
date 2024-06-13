import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ManifestCard from "../components/ManifestCard";
import { useSelector } from "react-redux";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    plate: "",
    tor: "",
    stantion: "",
  });

  const [manifests, setManifests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [plates, setPlates] = useState([]);
  const [tors, setTors] = useState([]);
  const [stantions, setStantions] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const plateFromUrl = urlParams.get("plate");
    const torFromUrl = urlParams.get("tor");
    const stantionFromUrl = urlParams.get("stantion");

    setSidebarData({
      searchTerm: searchTermFromUrl || "",
      plate: plateFromUrl || "",
      tor: torFromUrl || "",
      stantion: stantionFromUrl || "",
    });

    const fetchManifests = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      let apiUrl = `/api/manifest/getmanifests?${searchQuery}`;

      if (!currentUser.isAdmin) {
        apiUrl = `/api/manifest/getusermanifests?${searchQuery}`;
      }

      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setManifests(data.manifests);
        setLoading(false);
        setShowMore(data.manifests.length === 9);
      } else {
        setLoading(false);
      }
    };

    const fetchStantions = async () => {
      try {
        const res = await fetch(`/api/stantion/getstantions`);
        const data = await res.json();
        if (res.ok) {
          setStantions(data);
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
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchManifests();
    fetchTors();
    fetchPlates();
    fetchStantions();
  }, [location.search, currentUser.isAdmin]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevState) => ({
      ...prevState,
      [id]: value || "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("plate", sidebarData.plate);
    urlParams.set("tor", sidebarData.tor);
    urlParams.set("stantion", sidebarData.stantion);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfmanifests = manifests.length;
    const startIndex = numberOfmanifests;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/manifest/getmanifests?${searchQuery}`);
    if (res.ok) {
      const data = await res.json();
      setManifests((prevManifests) => [...prevManifests, ...data.manifests]);
      setShowMore(data.manifests.length === 9);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Plate:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.plate}
              id="plate"
            >
              <option value="">Uncategorized</option>
              {plates.map((plate) => (
                <option key={plate._id} value={plate.name}>
                  {plate.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Tor:</label>
            <Select onChange={handleChange} value={sidebarData.tor} id="tor">
              <option value="">Uncategorized</option>
              {tors.map((tor) => (
                <option key={tor._id} value={tor.name}>
                  {tor.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Stantion:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.stantion}
              id="stantion"
            >
              <option value="">Uncategorized</option>
              {stantions.map((stantion) => (
                <option key={stantion._id} value={stantion.name}>
                  {stantion.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Manifests Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && manifests.length === 0 && (
            <p className="text-xl text-gray-500">No manifests found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            manifests.map((manifest) => (
              <ManifestCard key={manifest._id} manifest={manifest} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
