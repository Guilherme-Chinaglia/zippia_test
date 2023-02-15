import { Card } from "@/pages/components/Card"
import axios from "axios"
import { NextPage } from "next"
import { Key, useState, useEffect } from "react"
import { useQuery } from "react-query"

// Creating the JobProps type and exporting it to be used in the Card component
export type JobProps = {
  jobId?: Key
  jobTitle: string
  companyName: string
  jobDescription: string
  postingDate?: string
}

/**
* Creating 3 states for Jobs:
* jobs that receives the API data,
* showRecentJobs, a boolean indicating whether the component should display recent data or not
* searchTerm, a string indicating what will be searched in the component (company name)
*/

const Jobs: NextPage = () => {
  const [jobs, setJobs] = useState<JobProps[]>([])
  const [showRecentJobs, setShowRecentJobs] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")


  /**
   * Used axios to fetch data from the API
   */
  const fetchJobs = async () => {
    const response = await axios.post(
      "https://www.zippia.com/api/jobs/",
      {
        companySkills: true,
        dismissedListingHashes: [],
        fetchJobDesc: true,
        locations: [],
        numJobs: 10,
        previousListingHashes: [],
      }
    )
    return response.data
  }

  /**
   *  Used useQuery to have greater control over the information obtained from the API
   */
  const { isLoading, data, isSuccess } = useQuery("jobs", fetchJobs)

  /**
   * Used useEffect to store the data obtained from the API
   * and facilitate data manipulation
   */
  useEffect(() => {
    if (isSuccess && data) {
      setJobs(data.jobs)
    }
  }, [isSuccess, data])

  /*
  * The API has postingDate, which allows me to know when the job was posted
  * and to retrieve jobs posted in the last 7 days
  */
  const recentJobs = jobs.filter((job) => {
    const dateDiff = job.postingDate ? Date.now() - new Date(job.postingDate).getTime() : 0
    const daysDiff = Math.floor(dateDiff / (1000 * 3600 * 24))
    return daysDiff <= 7
  })

  /**
   * In filteredJobs, I receive the jobs filtered through the searchTerm input field.
   * To make the data more consistent, I filtered it in lowercase.
   */
  const filteredJobs = jobs.filter((job) => {
    return job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  /**
   * Toggle-like function that shows either "Show all jobs" or "Published last 7 days"
   * Also, showRecentJobs receives a boolean indicating whether the component should
   * display recent data or not
   */
  const handleShowRecentJobs = () => {
    setShowRecentJobs((prevState) => !prevState)
  }

  /**
   * Function responsible for saving the searched string (Search Company Name)
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  if (isLoading) return <p>Loading...</p>
  return (
    <div className="container">
      <div className="flex flex-col items-center">
        <label className="text-xl font-bold" htmlFor="company_name">Search Company Name</label>
        <input className="h-10 border-2 my-4" type="text" onChange={handleSearch} value={searchTerm} id="company_name" placeholder="Type a company name" />
        <div className="flex">
          <button className="bg-blue-500 py-2 px-3 rounded-md text-white border-0 hover:bg-blue-600" onClick={handleShowRecentJobs}>
            {showRecentJobs ? "Show all jobs" : "Published last 7 days"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap w-full justify-center">
        {showRecentJobs
          ? recentJobs.map((job: JobProps) => (
              <Card
                key={job.jobId}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                jobDescription={job.jobDescription}
              />
            ))
          : filteredJobs.map((job: JobProps) => (
              <Card
                key={job.jobId}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                jobDescription={job.jobDescription}
              />
            ))}
      </div>
    </div>
  )
}

export default Jobs
