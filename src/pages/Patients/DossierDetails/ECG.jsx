import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import MedicalService from "../../../services/medical.service";
import icon7 from "../../../assets/icon7.png";
import iconFolder from "../../../assets/iconFolder.png";

const ECG = () => {
  const location = useLocation();
  const patient = location.state?.patient;
  const color = location.state?.color;
  const [imageFile, setImageFile] = useState(null);
  const [conclusion, setConclusion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("imageFile", imageFile);
      formData.append("conclusion", conclusion);
      // Call addEcg method from MedicalService to send ECG data
      const response = await MedicalService.addEcg(formData, patient.id);
      setLoading(false);
      setMessage(response.data.message);
      setSuccessful(true);
      // Handle success (e.g., redirect to another page)
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setLoading(false);
      setMessage(resMessage);
      setSuccessful(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleConclusionChange = (e) => {
    setConclusion(e.target.value);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <div className="flex items-center mb-6 w-full">{/* Search bar */}</div>
      <div className={`mb-6 ${color}`}>
        Mr Patient {patient?.prenom} {patient?.nom}
      </div>{" "}
      <div className="bg-white border border-black rounded-3xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-black flex justify-center w-full">
          <div className="text-center text-xl font-bold flex items-center justify-center">
            <img src={icon7} alt="Identité" className="mr-2 align-center w-8" />
            ECG
          </div>
        </div>
        {/* ECG form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 m-4 flex justify-between items-center">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <img src={iconFolder} alt="Folder Icon" className="h-14 w-14" />
          </div>
          <div className="p-6 m-4 text-center">
            <textarea
              className="w-full h-32 p-2 border"
              placeholder="Conclusion"
              value={conclusion}
              onChange={handleConclusionChange}
            ></textarea>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {message && (
            <div className="text-sm text-center text-gray-700 dark:text-gray-200 mb-8 m-4">
              <div
                className={`${
                  successful ? "bg-green-500" : "bg-red-500"
                } text-white font-bold rounded-lg border border-white shadow-lg p-5 m-4`}
                role="alert"
              >
                {message}
              </div>
            </div>
          )}{" "}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send ECG"}
          </button>
        </form>
        {/* Error handling */}
      </div>
    </div>
  );
};

export default ECG;