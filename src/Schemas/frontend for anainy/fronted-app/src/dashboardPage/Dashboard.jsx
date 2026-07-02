import React, { useEffect, useState, useContext } from 'react'
import '../dashboardPage/Dashboard.css'
import ShowReport from '../showrepoCompo/ShowReport';
import { InfoContext } from '../App';

const Dashboard = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [data, setData] = useState(null)
  const showInfo = useContext(InfoContext)

  async function getAllReport() {
    try {
      const response = await fetch("http://localhost:3000/api/interview/get-AllgeneratedReport", {
        method: "POST",
        credentials: 'include'
      })
      const allReport = await response.json();
      if (!response.ok) {
        throw new Error(allReport.message || "Could not fetch reports");
      }
      localStorage.setItem("allReport", JSON.stringify(allReport.data));
      setData(allReport.data);
    } catch (err) {
      console.error(err)
      showInfo(err.message || "Something went wrong while fetching reports")
    }
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("allReport");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err)
      showInfo("Could not load previously saved reports")
    }
  }, [])

  const Token = 100
  return (
    <div className='dashboard_card'>
      <div className='dashboardContainer'>
        <div className='reportContainer'>
          <h1>ALL Generated Reports : </h1>
          <div className='report_child'>
            {selectedReport && <ShowReport item={selectedReport} />}
          </div>

          {data?.length > 0 ? (
            <div className="buttonContainer">
              {data.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedReport(item)}
                >
                  View Report {index + 1}
                </button>
              ))}
            </div>
          ) : (
            <button onClick={getAllReport}>
              Get all Generated Reports
            </button>
          )}
        </div>

        <div className='childclassofDashboard TodolistContainer'>
          <h1>To Do List</h1>
          <button>
            Add to list
          </button>
        </div>
        <div className='childclassofDashboard secondChildofdshboard'>
          <div>
            <h2>Token left : {Token} </h2>
            <button>Upgrade To Get More Token</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
