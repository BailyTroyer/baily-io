import React, { FC } from "react"

interface Props {
  question: string
  answer: string
}

const FAQ: FC<Props> = (props: Props) => {
  const { question, answer } = props

  const [visible, setVisible] = React.useState(false)

  return (
    <div
      className="mx-auto my-3 flex flex-col max-w-3xl cursor-pointer select-none overflow-hidden"
      onClick={() => setVisible(!visible)}
    >
      <div className="bg-purple-400 rounded-t-md px-6 py-3">
        <h1 className="font-medium text-white lg:text-2xl text-xl">
          {question}
        </h1>
      </div>
      <div
        className={`flex-col bg-purple-100 px-5 py-2 ${
          visible ? "" : "hidden"
        }`}
      >
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default FAQ
