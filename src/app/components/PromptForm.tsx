import React from 'react'
import { BsArrowRight } from 'react-icons/bs'

interface PromptFormProps {
  handleSubmit:(e:React.FormEvent<HTMLFormElement>)=>void,
  setDescription:(description:string)=>void,
  description:string,
  loading:boolean,
}
const PromptForm = ({handleSubmit,setDescription,description,loading} : PromptFormProps ) => {
  return (
    <form
    onSubmit={handleSubmit}
    className="w-full flex flex-col justify-center items-center relative "
  >
    <textarea
      name="description"
      id="description"
      rows={4}
      placeholder="Write your thoughts here..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full block bg-transparent border-2 border-gray-800 rounded-lg  p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-gray-500 caret-gray-300 transition-colors duration-500 ease-in mb-4"
    />
    <button
      type="submit"
      className="absolute bottom-6 right-2 flex items-center bg-transparent rounded-full p-2 text-gray-200 font-medium border-2 border-gray-200 hover:bg-gray-900 hover:text-gray-100 transition-all duration-300 ease-in-out hover:scale-105"
      disabled={loading}
    >
      <BsArrowRight size={20} className="" />
    </button>
  </form>
  )
}

export default PromptForm