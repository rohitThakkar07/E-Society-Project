import React from "react";
import { useForm } from "react-hook-form";

const modules = ["Residents", "Maintenance", "Expense", "Facility"];

const CreateRole = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create Role</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <input
            type="text"
            placeholder="Role Name"
            {...register("roleName")}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <div>
            <h2 className="font-semibold mb-3">Permissions</h2>

            <div className="grid gap-4">
              {modules.map((module) => (
                <div key={module} className="border p-3 rounded-lg">
                  <p className="font-medium">{module}</p>

                  <div className="flex gap-4 mt-2">
                    <label>
                      <input type="checkbox" {...register(`${module}.view`)} /> View
                    </label>
                    <label>
                      <input type="checkbox" {...register(`${module}.create`)} /> Create
                    </label>
                    <label>
                      <input type="checkbox" {...register(`${module}.edit`)} /> Edit
                    </label>
                    <label>
                      <input type="checkbox" {...register(`${module}.delete`)} /> Delete
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Save Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;