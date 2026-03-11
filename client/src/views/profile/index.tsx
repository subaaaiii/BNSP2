import { useState, useContext, useEffect } from "react";
import { useUser } from "../../hooks/profile/useUser";
import { AuthContext } from "../../context/AuthContext";


const Profile = () => {
     const [isEditing, setIsEditing] = useState(false);
     const {user} = useContext(AuthContext)!;
     const userId = user?.id;
     const {data, isLoading} = useUser(userId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    birthday: "",
    gender: "",
    address: "",
    picture: ""
  });

  useEffect(() => {
  if (data) {
    setForm({
      name: data.name ?? "",
      email: data.email ?? "",
      birthday: data.birthday ?? "",
      gender: data.gender ?? "",
      address: data.address ?? "",
      picture: data.picture ?? "",
    });
  }
  console.log(data);
}, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };
  if (isLoading) {
  return (
    <div className="mb-10 w-full rounded-2xl bg-white p-10 shadow-xl animate-pulse">
      <div className="flex flex-col md:flex-row justify-between mb-5">
        
        <div className="space-y-4 w-full">
          <div className="h-10 bg-gray-200 rounded w-40"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>

        <div className="text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
        </div>

      </div>

      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

  return (
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
          <div>
            <h2 className="mb-5 text-4xl font-bold text-blue-900">
            Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Update Profile
            </button>
          )}
          </div>

          {/* AVATAR */}
        <div className="text-center mb-8">
          <img
            src="https://i.pravatar.cc/300"
            alt="Profile"
            className="rounded-full w-32 h-32 mx-auto border-4 border-indigo-800 mb-4"
          />

          {isEditing && (
            <>
              <input type="file" id="upload_profile" hidden />
              <label
                htmlFor="upload_profile"
                className="cursor-pointer text-sm text-indigo-700 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300"
              >
                Change Profile Picture
              </label>
            </>
          )}
        </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
              Birthday
            </label>
            <input
              type="tel"
              id="birthday"
              value={form.birthday}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {isEditing &&(
            <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={()=>setIsEditing(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;