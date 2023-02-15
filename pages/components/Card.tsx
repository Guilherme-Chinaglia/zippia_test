
// import the jobs type
import { JobProps } from "../test/jobs"

/**
* Creation of the Card component
* Styling the component with tailwindCSS
* The Card component receives a job object containing the jobTitle, companyName, and jobDescription.
* As the jobDescription contains html content, I used dangerouslySetInnerHTML to parse it as html.
* Due to the limitations of tailwindCSS, I created a .text class and styled it with style jsx.
*/
export const Card: React.FC<JobProps> = (job) => {
  return (
    <div className="border rounded-md max-w-sm h-56 overflow-hidden p-4 m-4">
      <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
      <p className="text-lg">{job.companyName}</p>
      <article className="text text-sm pt-4" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />

<style jsx>{`
    .text {
      -webkit-box-orient: vertical;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
    }
`}</style>

    </div>
  )
}
