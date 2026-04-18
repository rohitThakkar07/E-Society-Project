import React from "react";
import { useForm } from "react-hook-form";

const modules = ["Residents", "Maintenance", "Expense", "Facility"];

const CreateRole = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
        <p className="text-sm text-gray-500">Define new custom roles and their system permissions.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="admin-form-group max-w-md">
            <label className="admin-label">Role Name *</label>
            <input
              type="text"
              placeholder="e.g. Society Manager"
              {...register("roleName")}
              className="admin-input"
            />
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-gray-50 pb-2">Module Permissions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module) => (
                <div key={module} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                  <p className="font-bold text-slate-800 text-sm mb-3">{module}</p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {["view", "create", "edit", "delete"].map((action) => (
                      <label key={action} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          {...register(`${module}.${action}`)} 
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 capitalize">{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              className="admin-btn-primary"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;