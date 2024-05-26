import React, { useEffect, useState } from "react";
import { Button, Sidebar } from "flowbite-react";
import { BsCalendar, BsTable } from "react-icons/bs";
import { MdInfoOutline, MdOutlineBackupTable } from "react-icons/md";
import { PiFilesThin } from "react-icons/pi";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [tab, setTab] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {
            <Link to="/dashboard?tab=calendar">
              <Sidebar.Item
                active={tab === "calendar"}
                icon={BsCalendar}
                as="div"
              >
                Calendar
              </Sidebar.Item>
            </Link>
          }
          {
            <Link to="/dashboard?tab=manifests">
              <Sidebar.Item
                active={tab === "manifests"}
                icon={PiFilesThin}
                as="div"
              >
                Manifests
              </Sidebar.Item>
            </Link>
          }
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=selection">
                <Sidebar.Item
                  active={tab === "selection"}
                  icon={MdOutlineBackupTable}
                  as="div"
                >
                  Selection
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=add-user">
                <Sidebar.Item
                  active={tab === "add-user"}
                  icon={HiUser}
                  as="div"
                >
                  Add User
                </Sidebar.Item>
              </Link>
            </>
          )}
          {
            <Link to={"/create-manifest"}>
              <Button
                type="submit"
                gradientDuoTone="greenToBlue"
                className="w-full"
              >
                Create a Manifest
              </Button>
            </Link>
          }
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
