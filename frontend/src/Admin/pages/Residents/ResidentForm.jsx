import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidentById, createResident, updateResident } from "../../../store/slices/residentSlice";
import { fetchFlats } from "../../../store/slices/flatSlice";

const ResidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const { singleResident, loading } = useSelector((state) => state.resident);
  const { list: flats = [] } = useSelector((state) => state.flat);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active", residentType: "Owner" },
  });

  useEffect(() => {
    dispatch(fetchFlats());
    if (isEditMode) dispatch(fetchResidentById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleResident && isEditMode) {
      reset({
        ...singleResident,
        flat: singleResident.flat?._id || singleResident.flat,
        dateOfBirth: singleResident.dateOfBirth?.split("T")[0] || "",
        moveInDate: singleResident.moveInDate?.split("T")[0] || "",
      });
    }
  }, [singleResident, isEditMode, reset]);

  const onSubmit = async (data) => {
    // ✅ FIX: API response uses 'block' not 'wing', and 'floor' not 'floorNumber'
    const selectedFlat = flats.find((f) => f._id === data.flat);

    if (!selectedFlat) {
      alert("Please select a valid flat");
      return;
    }

    const formattedData = {
      ...data,
      // ✅ Use 'block' from API — fallback to wing if some entries use it
      wing: selectedFlat.wing || selectedFlat.block,
      flatNumber: selectedFlat.flatNumber,
      // ✅ API uses 'floor' not 'floorNumber'
      floorNumber: Number(selectedFlat.floor ?? selectedFlat.floorNumber ?? 0),
      flatType: selectedFlat.type,
      mobileNumber: data.mobileNumber.toString(),
    };

    if (isEditMode) {
      const result = await dispatch(updateResident({ id, formData: formattedData }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
    } else {
      const result = await dispatch(createResident(formattedData));
      if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
    }
  };

 const getFlatLabel = (f) => {
  return `${f.flatNumber} (${f.type})`;
};

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">{isEditMode ? "Edit" : "Add"} Resident</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="row g-3">
                  {/* Names */}
                  <div className="col-md-6">
                    <Input label="First Name *" name="firstName" reg={register} req="First name is required" err={errors.firstName} />
                  </div>
                  <div className="col-md-6">
                    <Input label="Last Name" name="lastName" reg={register} />
                  </div>

                  {/* Identity */}
                  <div className="col-md-6">
                    <Select label="Gender *" name="gender" reg={register} req="Gender is required" err={errors.gender} options={["Male", "Female"]} />
                  </div>
                  <div className="col-md-6">
                    <Input label="DOB" name="dateOfBirth" type="date" reg={register} />
                  </div>

                  {/* Contact */}
                  <div className="col-md-6">
                    <Input
                      label="Mobile *"
                      name="mobileNumber"
                      reg={register}
                      req="Mobile number is required"
                      pattern={{ value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" }}
                      err={errors.mobileNumber}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input label="Email" name="email" type="email" reg={register} />
                  </div>

                  {/* Flat */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Assign Flat *</label>
                      <select
                        {...register("flat", { required: "Assigning a flat is required" })}
                        className={`form-select ${errors.flat ? "is-invalid" : ""}`}
                      >
                        <option value="">Select a Flat</option>
                        {flats
                          .filter((f) => {
                            if (f.status === "Vacant") return true;
                            if (isEditMode && f._id === singleResident?.flat?._id) return true;
                            return false;
                          })
                          .map((f) => (
                            <option key={f._id} value={f._id}>
                              {getFlatLabel(f)}
                            </option>
                          ))}
                      </select>
                      {errors.flat && <div className="invalid-feedback">{errors.flat.message}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <Select label="Resident Type *" name="residentType" reg={register} options={["Owner", "Tenant"]} />
                  </div>
                  <div className="col-md-6">
                    <Input label="Move In Date" name="moveInDate" type="date" reg={register} />
                  </div>
                  <div className="col-md-6">
                    <Select label="Status" name="status" reg={register} options={["Active", "Inactive"]} />
                  </div>

                  {!isEditMode && (
                    <div className="col-12">
                      <Input
                        label="Password *"
                        name="password"
                        type="password"
                        reg={register}
                        req="Password is required"
                        minL={{ value: 6, message: "Password must be at least 6 characters" }}
                        err={errors.password}
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? "Saving..." : "Save Resident"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Helper Components ─────────────────────────────────────────────────────────

const Input = ({ label, name, type = "text", reg, req = false, err, pattern, minL }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input
      type={type}
      {...reg(name, {
        required: req,
        ...(pattern ? { pattern } : {}),
        ...(minL ? { minLength: minL } : {}),
      })}
      className={`form-control ${err ? "is-invalid" : ""}`}
    />
    {err && <div className="invalid-feedback">{err.message}</div>}
  </div>
);

const Select = ({ label, name, reg, options, req = false, err }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <select
      {...reg(name, { required: req })}
      className={`form-select ${err ? "is-invalid" : ""}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    {err && <div className="invalid-feedback">{err.message}</div>}
  </div>
);

export default ResidentForm;