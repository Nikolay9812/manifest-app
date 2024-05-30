import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Modal,
  Button,
  TextInput,
  Alert,
  Label,
  Spinner,
} from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineUserAdd } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserData(user);
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setEditUserData({ ...editUserData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleEditChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.id]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(editUserData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUserData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
      } else {
        setUpdateUserSuccess("User's profile updated successfully");
        setUsers((prev) =>
          prev.map((user) => (user._id === selectedUser._id ? data : user))
        );
        setShowEditModal(false);
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  const handleAddUserChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        setShowAddUserModal(false);
        setUsers([...users, data.users]);
        setFormData({});
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-end">
      <HiOutlineUserAdd
        className="text-2xl my-3 cursor-pointer"
        onClick={() => setShowAddUserModal(true)}
      />
      </div>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map(
                (user) =>
                  user && (
                    <Table.Body className="divide-y" key={user._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          <img
                            src={
                              user.profilePicture || "default_image_url_here"
                            }
                            alt={user.username || "N/A"}
                            className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username || "N/A"}</Table.Cell>
                        <Table.Cell>{user.email || "N/A"}</Table.Cell>
                        <Table.Cell>
                          {user.isAdmin ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            onClick={() => handleEditUser(user)}
                            className="font-medium text-blue-500 hover:underline cursor-pointer"
                          >
                            Edit
                          </span>
                          {" | "}
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
                            }}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  )
              )}
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        popup
        size="lg"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">
              Edit User
            </h1>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
              >
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62,152,199,${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || selectedUser?.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
                  ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                  }`}
                />
              </div>
              {imageFileUploadError && (
                <Alert color="failure">{imageFileUploadError}</Alert>
              )}

              <TextInput
                type="text"
                id="username"
                placeholder="username"
                defaultValue={selectedUser?.username}
                onChange={handleEditChange}
              />
              <TextInput
                type="email"
                id="email"
                placeholder="email"
                defaultValue={selectedUser?.email}
                onChange={handleEditChange}
              />
              <TextInput
                type="password"
                id="password"
                placeholder="password"
                onChange={handleEditChange}
              />
              <Button
                type="submit"
                gradientDuoTone="greenToBlue"
                outline
                disabled={imageFileUploading}
              >
                {imageFileUploading ? "Loading..." : "Update"}
              </Button>
            </form>
            {updateUserSuccess && (
              <Alert color="success" className="mt-5">
                {updateUserSuccess}
              </Alert>
            )}
            {updateUserError && (
              <Alert color="failure" className="mt-5">
                {updateUserError}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddUserModal} onClose={() => setShowAddUserModal(false)}>
        <Modal.Header>Add User</Modal.Header>
        <Modal.Body>
          <div className="max-w-lg mx-auto p-3 w-full">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleAddUserSubmit}
            >
              <div>
                <Label value="Username" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={handleAddUserChange}
                />
              </div>
              <div>
                <Label value="Email" />
                <TextInput
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  onChange={handleAddUserChange}
                />
              </div>
              <div>
                <Label value="Password" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={handleAddUserChange}
                />
              </div>
              <Button
                gradientDuoTone="greenToBlue"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </form>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
